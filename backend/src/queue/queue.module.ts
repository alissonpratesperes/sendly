import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ExpressAdapter } from '@bull-board/express';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

import { QueueService } from './queue.service';
import { requireEnvironmentVariable } from '../common/utils/requireEnvironmentVariable.util';

@Module({
    imports: [
        BullModule.forRoot({
            connection: {
                host: requireEnvironmentVariable("REDIS_HOST"),
                port: Number(requireEnvironmentVariable("REDIS_PORT")),
                password: requireEnvironmentVariable("REDIS_PASSWORD"),
            },
        }),
        BullModule.registerQueue({
            name: requireEnvironmentVariable("REDIS_QUEUE_NAME"),
        }),

        BullBoardModule.forRoot({
            route: requireEnvironmentVariable("REDIS_BULL_BOARD_URL"),
            adapter: ExpressAdapter,
             boardOptions: { uiConfig: { boardTitle: "Sendly - Dashboard", }, },
        }),
        BullBoardModule.forFeature({
            name: requireEnvironmentVariable("REDIS_QUEUE_NAME"),
            adapter: BullMQAdapter,
        }),
    ],
    providers: [
        QueueService,
    ],
    exports: [
        BullModule,
        QueueService,
    ],
})
export class QueueModule {}
