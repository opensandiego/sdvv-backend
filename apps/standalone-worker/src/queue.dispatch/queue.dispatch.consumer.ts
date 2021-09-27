import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { TransactionsXLSXService } from '../transactions.xlsx/transactions.xlsx.service';
import { ZipCodeCSVService } from '../zip.code.csv/zip.code.csv.service';
import { ElectionsUpdateService } from '../efile.api/elections.update.service';
import { CandidatesUpdateService } from '../efile.api/candidates.update.service';

@Processor('worker')
export class QueueDispatchConsumer {
  constructor(
    private zipCodeCSVService: ZipCodeCSVService,
    private transactionsXLSXService: TransactionsXLSXService,
    private electionsUpdateService: ElectionsUpdateService,
    private candidatesUpdateService: CandidatesUpdateService,
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

  @Process('update-elections')
  async updateElections() {
    console.log('Starting Elections Job');
    await this.electionsUpdateService.updateElections();
  }

  @Process('update-candidates')
  async updateCandidates(job: Job) {
    console.log('Starting Candidates Job');
    await this.candidatesUpdateService.updateCandidate(job.data['id']);
  }
}
