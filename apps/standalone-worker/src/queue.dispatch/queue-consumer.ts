import { Process, Processor } from '@nestjs/bull';
import { EventEmitter } from 'events';
import { ElectionsUpdateService } from '../efile.api/elections.update.service';
import { CandidatesUpdateService } from '../efile.api/candidates.update.service';
import { CandidatesInfoUpdateService } from '../efile.api/candidates-info.update.service';
import { UpdateCommitteesService } from '../efile.api/update.committes.service';
import { CandidateCommitteeService } from '@app/sdvv-database/process.data/candidate.committee.service';
import { TransactionsXLSXService } from '../transactions.xlsx/transactions.xlsx.service';
import { DeduplicateExpendituresService } from '@app/sdvv-database/process.data/deduplicate-expenditures.service';
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
    private deduplicateExpendituresService: DeduplicateExpendituresService,
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
    await this.candidatesInfoUpdateService.updateCandidatesInfo();
  }

  @Process('update-candidates-past')
  async updateCandidatesPast() {
    await this.updateCommitteesService.updateCommittees();
    await this.candidatesUpdateService.updateCandidatesPast();
    await this.candidateCommitteeService.addCandidateCommittees();
    await this.candidatesInfoUpdateService.updateCandidatesInfo();
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
    await this.deduplicateExpendituresService.removeDuplicateIndependentExpenditures();
    console.log(`updateTransactionsCurrent completed`);
  }

  @Process('update-transactions-past')
  async updateTransactionsPast() {
    await this.transactionsXLSXService.updateTransactionsPast();
    await this.deduplicateExpendituresService.removeDuplicateIndependentExpenditures();
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
    if (
      process.env.NODE_ENV === 'development' &&
      process.env.CHECK_UPDATE_INTERVAL === 'true'
    ) {
      const lastUpdate =
        await this.transactionsXLSXService.getLastUpdatedDateTime();

      const envInterval = parseInt(process.env.UPDATE_INTERVAL_HOURS);
      const interval = envInterval ? envInterval : 12;

      const hours = this.hoursSinceUpdate(lastUpdate);
      // Skip update if it has been less than 'interval' hours since the last update
      if (hours < interval && hours > 0) {
        console.log(`Last update was: ${lastUpdate}`);
        console.log(
          `Skipping update. Last update: ${hours.toFixed(2)} hours ago.`,
        );
        console.log(
          `Update only runs in development and if its been more than: ${interval} hours.`,
        );

        return;
      }
    }

    await this.updateElections();
    await this.updateCandidatesCurrent();
    await this.updateCandidatesPast();
    await this.updateTransactionsCurrent();
    await this.updateTransactionsPast();
    await this.updateZipCodes();
  }

  private hoursSinceUpdate(updateDate: string) {
    if (!updateDate) return 0;
    return Math.abs(Date.now() - Date.parse(updateDate)) / 36e5;
  }
}
