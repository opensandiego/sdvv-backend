import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { HttpModule } from '@nestjs/axios';
import { QueueAddController } from './queue.add.controller';
import { QueueProcessController } from './queue.process.controller';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'worker-add-data',
    }),
    BullModule.registerQueue({
      name: 'worker-process-data',
    }),
    HttpModule,
  ],
  providers: [],
  controllers: [QueueAddController, QueueProcessController],
  exports: [],
})
export class QueueProducerModule {}
