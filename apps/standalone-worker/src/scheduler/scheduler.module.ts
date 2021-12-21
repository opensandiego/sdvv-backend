import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerService } from './scheduler.service';
import { QueueProducerModule } from '../queue-producer/queue-producer.module';

@Module({
  imports: [ScheduleModule.forRoot(), QueueProducerModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
