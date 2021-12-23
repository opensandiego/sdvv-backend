import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class QueueController {
  constructor(
    @InjectQueue('worker-update-data') private readonly workerQueueAdd: Queue,
  ) {}

  async updateElections() {
    await this.workerQueueAdd.add('update-elections');
  }

  async updateCandidatesCurrent() {
    await this.workerQueueAdd.add('update-candidates-current');
  }

  async updateCandidatesPast() {
    await this.workerQueueAdd.add('update-candidates-past');
  }

  async updateTransactionsCurrent() {
    await this.workerQueueAdd.add('update-transactions-current');
  }

  async updateTransactionsPast() {
    await this.workerQueueAdd.add('update-transactions-past');
  }

  async updateZipCodes() {
    await this.workerQueueAdd.add('update-zip-codes');
  }

  async initializeData() {
    await this.workerQueueAdd.add('initialize-data');
  }
}
