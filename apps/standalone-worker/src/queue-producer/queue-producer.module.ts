import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { QueueController } from './queue.controller';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'worker-update-data',
    }),
  ],
  providers: [QueueController],
  exports: [QueueController],
})
export class QueueProducerModule {}
