import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { HttpModule } from '@nestjs/axios';
import { QueueController } from './queue.producer.controller';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'worker',
    }),
    HttpModule,
  ],
  providers: [],
  controllers: [QueueController],
  exports: [],
})
export class QueueProducerModule {}
