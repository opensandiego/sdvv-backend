import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { QueueController } from './queue.controller';

const url = new URL(process.env.REDIS_URL);

@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: url.hostname,
        port: Number(url.port),
      },
    }),
    BullModule.registerQueue({
      name: 'worker-update-data',
    }),
  ],
  providers: [QueueController],
  exports: [QueueController],
})
export class QueueProducerModule {}
