import { Controller, Param, Post } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Controller('filing')
export class FilingsController {
  constructor(
    @InjectQueue('process-filing') private readonly tasksQueue: Queue,
  ) {}

  @Post()
  async processTransactions() {
    return await this.tasksQueue.add('transactions-process-all');
  }

  @Post(':filing_id')
  async processOneTransaction(@Param('filing_id') filingID: string) {
    return await this.tasksQueue.add('filing-process-one', {
      filing_id: filingID,
    });
  }

  @Post('reset/transactions')
  async setAllTransactionsToNotProcessed() {
    return await this.tasksQueue.add('transactions-set-not-processed');
  }
}
