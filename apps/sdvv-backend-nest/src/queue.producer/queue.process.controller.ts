import { Body, Controller, Param, Post } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Controller('process')
export class QueueProcessController {
  constructor(
    @InjectQueue('worker-process-data')
    private readonly workerQueueProcess: Queue,
  ) {}

  @Post('candidates/set/committees')
  async setCandidateCommittees() {
    await this.workerQueueProcess.add('set-candidate-committees');
  }

  @Post('transactions/set/calculation/status')
  async setTransactionsCalculationStatus() {
    await this.workerQueueProcess.add('set-transactions-calculation-status');
  }

  @Post('transactions/set/sup-opp/status')
  async setTransactionsSupOpp() {
    await this.workerQueueProcess.add('set-transactions-sup-opp');
  }
}
