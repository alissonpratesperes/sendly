import { Job } from 'bullmq';
import { ClsService } from 'nestjs-cls';
import { Processor, WorkerHost } from '@nestjs/bullmq';

import { BatchService } from '../batch.service';
import { BatchSendService } from '../batchSend.service';
import { BaileysService } from '../../baileys/baileys.service';
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
        return this.clsService.run(async () => {
            this.clsService.set("isSystemOperation", true);

            const { batchSendId } = job.data;
            const started = await this.batchSendService.startProcessing(batchSendId);

            if (!started) {
                return;
            }

            const batchSend = await this.batchSendService.readForProcessing(batchSendId);

            if (!batchSend) {
                return;
            }

            const content = (batchSend.TemplateSnapshot as any)?.content || batchSend.TemplateSnapshot;

            try {
                const response = await this.baileysService.sendTemplateSingleMessage(batchSend.Batch.CompanyId, batchSend.Contact.Phone, content);
                const messageId = response.key?.id ?? `FALLBACK_ID_${ Date.now() }`;

                await this.batchSendService.markAsSent(batchSendId, messageId);
                await this.batchService.finishIfCompleted(batchSend.BatchId);
            } catch (error) {
                console.error(`[Processor] Erro ao enviar BatchSend "${ batchSendId }" (Tentativa ${ job.attemptsMade + 1 } de ${ job.opts.attempts })`, error);

                const isLastAttempt = job.attemptsMade + 1 >= (job.opts.attempts ?? 1);

                if (isLastAttempt) {
                    await this.batchSendService.markAsFailed(batchSendId, "BAILEYS_ERROR", error instanceof Error ? error.message : "Unknown 'Baileys' error");
                    await this.batchService.finishIfCompleted(batchSend.BatchId);
                }

                throw error;
            }
        });
    }
}
