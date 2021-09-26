import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { TransactionsXLSXService } from '../transactions.xlsx/transactions.xlsx.service';
import { ZipCodeCSVService } from '../zip.code.csv/zip.code.csv.service';

@Processor('worker')
export class QueueDispatchConsumer {
  constructor(
    private zipCodeCSVService: ZipCodeCSVService,
    private transactionsXLSXService: TransactionsXLSXService,
  ) {}

  @Process('zip-codes')
  async addZipCodesToDatabase() {
    await this.zipCodeCSVService.populateDatabaseWithZipCodes();
  }

  @Process('transactions-xlsx')
  async addXLXSTransactionsToDatabase() {
    this.transactionsXLSXService.populateDatabaseWithXLSXTransactions(
      2020,
      'F460-D',
    );
  }
}
