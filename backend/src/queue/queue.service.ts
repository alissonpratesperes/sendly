import { Queue } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';

import { PrismaService } from '../prisma/prisma.service';
import { requireEnvironmentVariable } from '../common/utils/requireEnvironmentVariable.util';

@Injectable()
export class QueueService {
    constructor(
        @InjectQueue(requireEnvironmentVariable("REDIS_QUEUE_NAME"))
        private readonly queue: Queue,
        private readonly prismaService: PrismaService,
    ) {}

    private readonly queueName = requireEnvironmentVariable("REDIS_QUEUE_NAME");

    async enqueueBatchSends(batchSendIds: number[]): Promise<void> {
        if (!batchSendIds.length) {
            return;
        }

        const batchSends = await this.prismaService.client.batchSend.findMany({
            where: {
                Id: {
                    in: batchSendIds,
                },
            },
            select: {
                Id: true,
                ScheduledAt: true,
            },
        });
        const now = Date.now();
        const jobs = batchSends.map((batchSend) => ({
            name: this.queueName,
            data: {
                batchSendId: batchSend.Id,
            },
            opts: {
                jobId: `batch-send-${ batchSend.Id }`,
                delay: Math.max(0, (batchSend.ScheduledAt?.getTime() ?? now) - now),
                removeOnComplete: true,
                removeOnFail: true,
                attempts: 3,
                backoff: {
                    type: "exponential" as const,
                    delay: 5000,
                },
            },
        }));

        await this.queue.addBulk(jobs);
    }
}
