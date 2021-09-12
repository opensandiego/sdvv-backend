import { Controller, Param, Post } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Controller('filing')
export class FilingsController {
  constructor(
    @InjectQueue('process-filing') private readonly tasksQueue: Queue,
  ) {}

  @Post(':filing_id')
  async processOneTransaction(@Param('filing_id') filingID: string) {
    console.log('processOneTransaction');

    return await this.tasksQueue.add('filing-process-one', {
      filing_id: filingID,
    });
  }

  @Post()
  async processTransactions() {
    console.log('processTransactions');

    return await this.tasksQueue.add('transactions-process-all');
  }
}
