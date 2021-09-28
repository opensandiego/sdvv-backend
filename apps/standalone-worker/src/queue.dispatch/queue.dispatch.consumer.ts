import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ElectionsUpdateService } from '../efile.api/elections.update.service';
import { UpdateCommitteesService } from '../efile.api/update.committes.service';
import { CandidatesUpdateService } from '../efile.api/candidates.update.service';
import { UpdateFilingsService } from '../efile.api/update.filings.service';
import { TransactionsXLSXService } from '../transactions.xlsx/transactions.xlsx.service';
import { ZipCodeCSVService } from '../zip.code.csv/zip.code.csv.service';
import { UpdateIndepExpnService } from '@app/sdvv-database/process.data/update.indep.expn.service';

@Processor('worker')
export class QueueDispatchConsumer {
  constructor(
    private electionsUpdateService: ElectionsUpdateService,
    private updateCommitteesService: UpdateCommitteesService,
    private candidatesUpdateService: CandidatesUpdateService,
    private updateFilingsService: UpdateFilingsService,
    private transactionsXLSXService: TransactionsXLSXService,
    private zipCodeCSVService: ZipCodeCSVService,
    private updateIndepExpnService: UpdateIndepExpnService,
  ) {}

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

  @Process('set-transactions-sup-opp')
  async setTransactionsSupOpp() {
    console.log('Starting Setting Support & Opposed on Transactions Job');
    await this.updateIndepExpnService.setTransactionsSupOpp();
  }

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
}
