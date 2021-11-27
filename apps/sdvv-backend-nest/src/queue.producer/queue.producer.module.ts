import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { QueueAddController } from './queue.add.controller';
import { QueueProcessController } from './queue.process.controller';
import { TasksService } from './task.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'worker-add-data',
    }),
    BullModule.registerQueue({
      name: 'worker-process-data',
    }),
    HttpModule,
    ScheduleModule.forRoot(),
  ],
  providers: [TasksService],
  controllers: [QueueAddController, QueueProcessController],
  exports: [],
})
export class QueueProducerModule {}
