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
}
