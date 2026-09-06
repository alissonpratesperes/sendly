import { Job } from 'bullmq';
import { Processor, WorkerHost } from '@nestjs/bullmq';

@Processor('batch-send')
export class BatchSendProcessor extends WorkerHost {
    async process(job: Job<{ batchSendId: number }>): Promise<void> {
        console.log(`Processing BatchSend ${job.data.batchSendId}`);
    }
}
