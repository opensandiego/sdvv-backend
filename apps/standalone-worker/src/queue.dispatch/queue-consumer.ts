import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ElectionsUpdateService } from '../efile.api/elections.update.service';
import { UpdateCommitteesService } from '../efile.api/update.committes.service';
import { CandidatesUpdateService } from '../efile.api/candidates.update.service';
import { UpdateFilingsService } from '../efile.api/update.filings.service';
import { UpdateTransactionsService } from '../efile.api/update.transactions.service';
import { TransactionsXLSXService } from '../transactions.xlsx/transactions.xlsx.service';
import { ZipCodeCSVService } from '../zip.code.csv/zip.code.csv.service';
import { JurisdictionZipCodeService } from '../zip.code.csv/jurisdiction.zip.codes.service';
import { CandidateCommitteeService } from '@app/sdvv-database/process.data/candidate.committee.service';

@Processor('worker-update-data')
export class QueueConsumer {
  constructor(
    private electionsUpdateService: ElectionsUpdateService,
    private updateCommitteesService: UpdateCommitteesService,
    private candidateCommitteeService: CandidateCommitteeService,
    private candidatesUpdateService: CandidatesUpdateService,
    private updateFilingsService: UpdateFilingsService,
    private updateTransactionsService: UpdateTransactionsService,
    private transactionsXLSXService: TransactionsXLSXService,
    private zipCodeCSVService: ZipCodeCSVService,
    private jurisdictionZipCodeService: JurisdictionZipCodeService,
  ) {}

  @Process('update-elections')
  async updateElections() {
    await this.electionsUpdateService.updateElections();
  }

  @Process('update-candidates-current')
  async updateCandidatesCurrent() {
    await this.updateCommitteesService.updateCommittees();
    await this.candidatesUpdateService.updateCandidatesCurrent();
    await this.candidateCommitteeService.addCandidateCommittees();
  }

  @Process('update-candidates-past')
  async updateCandidatesPast() {
    await this.updateCommitteesService.updateCommittees();
    await this.candidatesUpdateService.updateCandidatesPast();
    await this.candidateCommitteeService.addCandidateCommittees();
  }

  @Process('update-transactions-current')
  async updateTransactionsCurrent() {
    await this.transactionsXLSXService.updateTransactionsCurrent();
  }

  @Process('update-transactions-past')
  async updateTransactionsPast() {
    await this.transactionsXLSXService.updateTransactionsPast();
  }

  @Process('zip-codes')
  async addZipCodesToDatabase() {
    await this.zipCodeCSVService.populateDatabaseWithZipCodes();
  }

  @Process('jurisdiction-zip-codes')
  async addJurisdictionZipCodesToDatabase() {
    await this.jurisdictionZipCodeService.populateDatabaseWithJurisdictionZipCodes();
  }

  @Process('transactions-xlsx')
  async addXLXSTransactionsToDatabase(job: Job) {
    console.log(
      `Started adding ${job.data['year']} transactions from xlsx to database`,
    );
    await this.transactionsXLSXService.populateDatabaseWithXLSXWorksheets(
      job.data['year'],
    );
    console.log(`Finished adding ${job.data['year']} transactions`);
  }
}
