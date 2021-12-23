import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { QueueController } from '../queue-producer/queue.controller';

@Injectable()
export class SchedulerService {
  constructor(private queueController: QueueController) {}

  @Cron('0 0 6,18 * * *')
  async updateTransactionsCurrent() {
    await this.queueController.updateTransactionsCurrent();
  }

  @Cron('0 0 12 * * sat')
  async updateTransactionsPast() {
    await this.queueController.updateTransactionsPast();
  }

  @Cron('0 0 12 * * sun')
  async updateCandidatesCurrent() {
    await this.queueController.updateCandidatesCurrent();
  }
}
