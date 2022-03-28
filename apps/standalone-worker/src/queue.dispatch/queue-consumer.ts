import { Process, Processor } from '@nestjs/bull';
import { EventEmitter } from 'events';
import { ElectionsUpdateService } from '../efile.api/elections.update.service';
import { CandidatesUpdateService } from '../efile.api/candidates.update.service';
import { CandidatesInfoUpdateService } from '../efile.api/candidates-info.update.service';
import { UpdateCommitteesService } from '../efile.api/update.committes.service';
import { CandidateCommitteeService } from '@app/sdvv-database/process.data/candidate.committee.service';
import { TransactionsXLSXService } from '../transactions.xlsx/transactions.xlsx.service';
import { ZipCodeCSVService } from '../zip.code.csv/zip.code.csv.service';
import { JurisdictionZipCodeService } from '../zip.code.csv/jurisdiction.zip.codes.service';

@Processor('worker-update-data')
export class QueueConsumer {
  constructor(
    private electionsUpdateService: ElectionsUpdateService,
    private updateCommitteesService: UpdateCommitteesService,
    private candidateCommitteeService: CandidateCommitteeService,
    private candidatesUpdateService: CandidatesUpdateService,
    private candidatesInfoUpdateService: CandidatesInfoUpdateService,
    private transactionsXLSXService: TransactionsXLSXService,
    private zipCodeCSVService: ZipCodeCSVService,
    private jurisdictionZipCodeService: JurisdictionZipCodeService,
  ) {
    EventEmitter.defaultMaxListeners = 15;
  }

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

  @Process('update-candidates-info')
  async updateCandidatesInfo() {
    await this.candidatesUpdateService.updateCandidatesCurrent();
    await this.candidatesUpdateService.updateCandidatesPast();
    await this.candidatesInfoUpdateService.updateCandidatesInfo();
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

  @Process('update-zip-codes')
  async updateZipCodes() {
    await this.zipCodeCSVService.populateDatabaseWithZipCodes();
    await this.jurisdictionZipCodeService.populateDatabaseWithJurisdictionZipCodes();
  }

  @Process('initialize-data')
  async initializeData() {
    await this.updateElections();
    await this.updateCandidatesCurrent();
    await this.updateCandidatesPast();
    await this.updateTransactionsCurrent();
    await this.updateTransactionsPast();
    await this.updateZipCodes();
  }
}
