import { Job } from 'bullmq';
import { Processor, WorkerHost } from '@nestjs/bullmq';

import { BatchService } from '../batch.service';
import { BatchSendService } from '../batchSend.service';

@Processor('batch-send')
export class BatchSendProcessor extends WorkerHost {
    constructor(
        private readonly batchService: BatchService,
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

        const batchSend = await this.batchSendService.read(batchSendId);

        try {
            // if (batchSendId % 2 !== 0) {
            //     throw new Error("Erro simulado de envio");
            // }

            // throw new Error("Erro simulado de envio");

            const fakeMessageId = `msg_fake_${Date.now()}`;

            await this.batchSendService.markAsSent(batchSendId, fakeMessageId);
            await this.batchService.finishIfCompleted(batchSend.BatchId);
        } catch (error) {
            await this.batchSendService.markAsFailed(
                batchSendId,
                "SEND_ERROR",
                error instanceof Error ? error.message : "Unknown error",
            );

            await this.batchService.finishIfCompleted(batchSend.BatchId);
        }
    }
}
