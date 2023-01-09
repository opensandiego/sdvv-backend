import {
  OnQueueActive,
  OnQueueCompleted,
  // OnQueueProgress,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
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
import { ConfigService } from '@nestjs/config';
import { ShutdownService } from './shutdown.service';

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
    private configService: ConfigService,
    private shutdownService: ShutdownService,
  ) {
    EventEmitter.defaultMaxListeners = 15;
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(`Started job with id: ${job.id}, type: '${job.name}'`);
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    console.log(`Completed job with id: ${job.id}, type: '${job.name}'`);

    const inTESTING_MODE = this.configService.get<boolean>('root.TESTING_MODE');
    if (inTESTING_MODE) {
      console.log(`Requesting Shutdown ...`);
      this.shutdownService.shutdown();
    }
  }

  // @OnQueueProgress()
  // onProgress(job: Job, progress: number) {
  //   console.log(`Job ${job.id} progress at ${progress}%.`);
  // }

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
  async initializeData(job: Job<unknown>) {

    let progress = 0;
    await job.progress(progress);

    await this.electionsUpdateService.updateElections();
    await job.progress((progress += 5));

    await this.updateCommitteesService.updateCommittees();
    await job.progress((progress += 5));
    await this.candidatesUpdateService.updateCandidatesCurrent();
    await job.progress((progress += 10));

    await this.candidatesUpdateService.updateCandidatesPast();
    await job.progress((progress += 10));

    await this.candidateCommitteeService.addCandidateCommittees();
    await job.progress((progress += 5));

    await this.candidatesInfoUpdateService.updateCandidatesInfo();
    await job.progress((progress += 5));

    await this.transactionsXLSXService.updateTransactionsCurrent();
    await job.progress((progress += 10));

    await this.transactionsXLSXService.updateTransactionsPast();
    await job.progress((progress += 20));

    await this.deduplicateExpendituresService.removeDuplicateIndependentExpenditures();
    await job.progress((progress += 5));

    // await this.zipCodeCSVService.populateDatabaseWithZipCodes(); // Is this needed?
    await this.jurisdictionZipCodeService.populateDatabaseWithJurisdictionZipCodes();
    await job.progress(100);
  }
}
