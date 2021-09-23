import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { TransactionEntity } from 'src/transactions/transactions.entity';
import { Connection } from 'typeorm';
import { ProcessFilingService } from './process.filing.service';

@Processor('process-filing')
export class FilingProcessor {
  constructor(
    private connection: Connection,
    private processFilingService: ProcessFilingService,
  ) {}

  @Process('transactions-set-not-processed')
  async setAllTransactionsToNotProcessed() {
    console.log('transactions-set-not-processed: started');
    try {
      await this.connection
        .createQueryBuilder()
        .update(TransactionEntity)
        .set({
          has_been_processed: false,
        })
        .execute();
    } catch (error) {
      console.log('Error in transactions-set-not-processed');
    }

    console.log('transactions-set-not-processed: completed');
    return {};
  }

  @Process('filing-process-one')
  async processOneFiling(job: Job<unknown>) {
    console.log('filing-process-one: started');
    try {
      const filingID = job.data.filing_id;

      await this.processFilingService.processFilings(filingID);
    } catch (error) {
      console.log('Error in filing-process-one');
    }

    console.log('filing-process-one: completed');
    return {};
  }

  @Process('filings-process-all')
  async processAllFilings(job: Job<unknown>) {
    console.log('filings-process-all: started');
    try {
      await this.processFilingService.processFilings();
    } catch (error) {
      console.log('Error in filings-process-all');
    }

    console.log('filings-process-all: completed');
    return {};
  }
}
