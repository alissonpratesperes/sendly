import { Queue } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';

import { requireEnvironmentVariable } from '../common/utils/requireEnvironmentVariable.util';
import { generateIntervalInMilliseconds } from '../common/utils/generateIntervalInMilliseconds.util';

@Injectable()
export class QueueService {
    constructor(
        @InjectQueue(requireEnvironmentVariable("REDIS_QUEUE_NAME"))
        private readonly queue: Queue,
    ) {}

    async enqueueBatchSends(batchSendIds: number[]): Promise<void> {
        const jobs = batchSendIds.map((batchSendId) => ({
            name: requireEnvironmentVariable("REDIS_QUEUE_NAME"),
            data: { batchSendId },
            opts: {
                // delay: generateIntervalInMilliseconds(),
                removeOnComplete: true,
                attempts: 3,
                // backoff: {
                //     type: "exponential",
                //     delay: 5000,
                // },
            },
        }));

        await this.queue.addBulk(jobs);
    }
}