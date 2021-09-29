import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ElectionsUpdateService } from '../efile.api/elections.update.service';
import { UpdateCommitteesService } from '../efile.api/update.committes.service';
import { CandidatesUpdateService } from '../efile.api/candidates.update.service';
import { UpdateFilingsService } from '../efile.api/update.filings.service';
import { UpdateTransactionsService } from '../efile.api/update.transactions.service';
import { TransactionsXLSXService } from '../transactions.xlsx/transactions.xlsx.service';
import { ZipCodeCSVService } from '../zip.code.csv/zip.code.csv.service';

@Processor('worker-add-data')
export class QueueConsumerAdd {
  constructor(
    private electionsUpdateService: ElectionsUpdateService,
    private updateCommitteesService: UpdateCommitteesService,
    private candidatesUpdateService: CandidatesUpdateService,
    private updateFilingsService: UpdateFilingsService,
    private updateTransactionsService: UpdateTransactionsService,
    private transactionsXLSXService: TransactionsXLSXService,
    private zipCodeCSVService: ZipCodeCSVService,
  ) {}

  @Process('update-elections')
  async updateElections() {
    console.log('Starting Elections Job');
    await this.electionsUpdateService.updateElections();
  }

  @Process('update-committees')
  async updateCommittees() {
    console.log('Starting Committees Job');
    await this.updateCommitteesService.updateCommittees();
  }

  @Process('update-candidates')
  async updateCandidates(job: Job) {
    console.log('Starting Candidates Job');
    await this.candidatesUpdateService.updateCandidate(job.data['id']);
  }

  @Process('update-filings')
  async updateFilings(job: Job) {
    console.log('Starting Filings Job');

    await this.updateFilingsService.updateFilings(
      job.data['oldestDate'],
      job.data['newestDate'],
    );
  }

  @Process('update-transactions')
  async updateTransactions(job: Job) {
    console.log('Starting Transactions Job');

    await this.updateTransactionsService.updateTransactions(
      job.data['oldestDate'],
      job.data['newestDate'],
    );
  }

  @Process('zip-codes')
  async addZipCodesToDatabase() {
    await this.zipCodeCSVService.populateDatabaseWithZipCodes();
  }

  @Process('transactions-xlsx')
  async addXLXSTransactionsToDatabase(job: Job) {
    this.transactionsXLSXService.populateDatabaseWithXLSXTransactions(
      job.data['year'],
      job.data['sheet'],
    );
  }
}
