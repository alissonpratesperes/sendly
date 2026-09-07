import { Job } from 'bullmq';
import { Processor, WorkerHost } from '@nestjs/bullmq';

import { BatchService } from '../batch.service';
import { BatchSendService } from '../batchSend.service';
import { BaileysService } from '../../baileys/baileys.service';
import { requireEnvironmentVariable } from '../../common/utils/requireEnvironmentVariable.util';

@Processor(requireEnvironmentVariable("REDIS_QUEUE_NAME"))
export class BatchSendProcessor extends WorkerHost {
    constructor(
        private readonly batchService: BatchService,
        private readonly baileysService: BaileysService,
        private readonly batchSendService: BatchSendService,
    ) {
        super();
    }

    async process(job: Job<{ batchSendId: number }>): Promise<void> {
        const { batchSendId } = job.data;
        const started = await this.batchSendService.startProcessing(batchSendId);

        if (!started) {
            return;
        }

        const batchSend = await this.batchSendService.readForProcessing(batchSendId);

        if (!batchSend) {
            return;
        }

        const content = (batchSend.TemplateSnapshot as any)?.content;

        let messageText = "";

        if (typeof content === "string") {
            messageText = content;
        } else if (content && typeof content === "object") {
            const parts = [
                content.header ? `*${content.header}*` : null,
                content.body || null,
                content.footer ? `_${content.footer}_` : null,
            ].filter(Boolean);

            messageText = parts.join("\n\n");
        }
        if (!messageText.trim()) {
            messageText = "Message with no content";
        }

        try {
            const response = await this.baileysService.sendMessage(
                batchSend.Batch.CompanyId,
                batchSend.Contact.Phone,
                messageText,
            );
            const messageId = response.key?.id ?? `FALLBACK_ID_${Date.now()}`;

            await this.batchSendService.markAsSent(batchSendId, messageId);
            await this.batchService.finishIfCompleted(batchSend.BatchId);
        } catch (error) {
            console.error(`[Processor] Error to send BatchSend: "${batchSendId}"`, error);

            await this.batchSendService.markAsFailed(
                batchSendId,
                "BAILEYS_ERROR",
                error instanceof Error ? error.message : "Unknown 'Baileys' error",
            );

            await this.batchService.finishIfCompleted(batchSend.BatchId);
        }
    }
}