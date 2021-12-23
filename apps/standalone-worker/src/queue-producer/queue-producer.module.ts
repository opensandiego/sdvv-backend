import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { QueueController } from './queue.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.forRoot({
      redis: process.env.REDIS_URL,
    }),
    BullModule.registerQueue({
      name: 'worker-update-data',
    }),
  ],
  providers: [QueueController],
  exports: [QueueController],
})
export class QueueProducerModule {}
