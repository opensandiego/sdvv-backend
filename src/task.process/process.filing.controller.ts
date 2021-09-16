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
    await this.tasksQueue.add('filings-process-all');
  }

  @Post(':filing_id')
  async processOneTransaction(@Param('filing_id') filingID: string) {
    await this.tasksQueue.add('filing-process-one', {
      filing_id: filingID,
    });
  }

  @Post('reset/transactions')
  async setAllTransactionsToNotProcessed() {
    await this.tasksQueue.add('transactions-set-not-processed');
  }
}
