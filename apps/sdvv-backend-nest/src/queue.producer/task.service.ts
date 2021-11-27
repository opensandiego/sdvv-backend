import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Queue } from 'bull';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  electionYears = ['2022', '2020', '2018', '2016'];

  constructor(
    @InjectQueue('worker-add-data') private readonly workerQueueAdd: Queue,
  ) {}
}
