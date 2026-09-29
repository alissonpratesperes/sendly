import { Job } from 'bullmq';
import { ClsService } from 'nestjs-cls';
import { Processor, WorkerHost } from '@nestjs/bullmq';

import { BatchService } from '../batch.service';
import { BatchSendService } from '../batchSend.service';
import { BaileysService } from '../../baileys/baileys.service';
import { TemplateSnapshot } from '../types/templateSnapshot.type';
import { requireEnvironmentVariable } from '../../common/utils/requireEnvironmentVariable.util';

@Processor(requireEnvironmentVariable("REDIS_QUEUE_NAME"))
export class BatchSendProcessor extends WorkerHost {
    constructor(
        private readonly clsService: ClsService,
        private readonly batchService: BatchService,
        private readonly baileysService: BaileysService,
        private readonly batchSendService: BatchSendService,
    ) {
        super();
    }

    async process(job: Job<{ batchSendId: number }>): Promise<void> {
        const { batchSendId } = job.data;
        const batchSend = await this.batchSendService.readForProcessingSystem(batchSendId);

        if (!batchSend) {
            return;
        }

        await this.clsService.run(async () => {
            this.clsService.set("isSystemRoot", false);
            this.clsService.set("companyId", batchSend.Batch.CompanyId);

            const started = await this.batchSendService.startProcessing(batchSend.Batch.CompanyId, batchSendId);

            if (!started) {
                return;
            }

            await this.batchService.markAsRunning(batchSend.Batch.CompanyId, batchSend.BatchId);

            try {
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
                }

                throw error;
            }
        });
    }
}
