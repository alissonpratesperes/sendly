import { Queue } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';

import { requireEnvironmentVariable } from '../common/utils/requireEnvironmentVariable.util';
import { generateSpacedIntervalInMilliseconds } from '../common/utils/generateSpacedIntervalInMilliseconds.util';

@Injectable()
export class QueueService {
    constructor(
        @InjectQueue(requireEnvironmentVariable("REDIS_QUEUE_NAME"))
        private readonly queue: Queue,
    ) {}

    private readonly queueName = requireEnvironmentVariable("REDIS_QUEUE_NAME");
    private readonly queueInterval = requireEnvironmentVariable("REDIS_QUEUE_INTERVAL");

    async enqueueBatchSends(batchSendIds: number[]): Promise<void> {
        if (!batchSendIds.length) {
            return;
        }

        const jobs = batchSendIds.map((batchSendId) => ({
            name: this.queueName,
            data: { batchSendId },
            opts: {
                delay: generateSpacedIntervalInMilliseconds(Number(this.queueInterval)),
                removeOnComplete: false,
                removeOnFail: false,
                attempts: 3,
                backoff: {
                    type: "exponential",
                    delay: 5000,
                },
            },
        }));

        await this.queue.addBulk(jobs);
    }
}
