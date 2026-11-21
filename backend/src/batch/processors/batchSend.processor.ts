import { ClsService } from 'nestjs-cls';
import { DelayedError, Job } from 'bullmq';
import { Processor, WorkerHost } from '@nestjs/bullmq';

import { BatchService } from '../batch.service';
import { BatchSendService } from '../batchSend.service';
import { BaileysService } from '../../baileys/baileys.service';
import { TemplateSnapshot } from '../types/templateSnapshot.type';
import { BatchSendSchedulerService } from '../batchSendScheduler.service';
import { requireEnvironmentVariable } from '../../common/utils/requireEnvironmentVariable.util';

@Processor(requireEnvironmentVariable("REDIS_QUEUE_NAME"))
export class BatchSendProcessor extends WorkerHost {
    constructor(
        private readonly clsService: ClsService,
        private readonly batchService: BatchService,
        private readonly baileysService: BaileysService,
        private readonly batchSendService: BatchSendService,
        private readonly batchSendSchedulerService: BatchSendSchedulerService,
    ) {
        super();
    }

    async process(job: Job<{ batchSendId: number }>, token?: string): Promise<void> {
        const { batchSendId } = job.data;
        const batchSend = await this.batchSendService.readForProcessingSystem(batchSendId);

        if (!batchSend) {
            return;
        }

        await this.clsService.run(async () => {
            this.clsService.set("isSystemRoot", false);
            this.clsService.set("companyId", batchSend.Batch.CompanyId);

            const now = new Date();
            const effectiveDate = new Date(Math.max(now.getTime(), batchSend.ScheduledAt?.getTime() ?? now.getTime()));
            const nextAvailableDate = this.batchSendSchedulerService.getNextBusinessDate(effectiveDate);

            if (nextAvailableDate.getTime() > now.getTime()) {
                if (!token) {
                    throw new Error("BullMQ job token is required to reschedule");
                }

                const rescheduled = await this.batchSendService.reschedule(batchSend.Batch.CompanyId, batchSendId, nextAvailableDate, batchSend.ScheduledAt);

                if (!rescheduled) {
                    return;
                }

                await job.moveToDelayed(nextAvailableDate.getTime(), token);

                throw new DelayedError();
            }

            const started = await this.batchSendService.startProcessing(batchSend.Batch.CompanyId, batchSendId);

            if (!started) {
                return;
            }

            try {
                await this.batchService.markAsRunning(batchSend.Batch.CompanyId, batchSend.BatchId);

                const templateSnapshot = batchSend.TemplateSnapshot as unknown as TemplateSnapshot;
                const response = await this.baileysService.sendTemplateSingleMessage(batchSend.Batch.CompanyId, batchSend.Contact.Phone, JSON.stringify(templateSnapshot.content));
                const messageId = response.key?.id ?? `FALLBACK_ID_${ Date.now() }`;

                await this.batchSendService.markAsSent(batchSend.Batch.CompanyId, batchSendId, messageId);
                await this.batchService.finishIfCompleted(batchSend.BatchId);
            } catch (error) {
                console.error(`[Processor] Erro ao enviar BatchSend "${ batchSendId }" (Tentativa ${ job.attemptsMade + 1 } de ${ job.opts.attempts })`, error);

                const isLastAttempt = job.attemptsMade + 1 >= (job.opts.attempts ?? 1);

                if (isLastAttempt) {
                    await this.batchSendService.markAsFailed(batchSend.Batch.CompanyId, batchSendId, "BAILEYS_ERROR", error instanceof Error ? error.message : "Unknown 'Baileys' error");
                    await this.batchService.finishIfCompleted(batchSend.BatchId);
                } else {
                    await this.batchSendService.releaseForRetry(batchSend.Batch.CompanyId, batchSendId);
                }

                throw error;
            }
        });
    }
}
