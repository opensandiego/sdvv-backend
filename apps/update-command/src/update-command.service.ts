import { Injectable } from '@nestjs/common';
import { TypeOrmHealthIndicator } from '@nestjs/terminus';
import { ElectionsUpdateService } from './efile.api/elections.update.service';
import { UpdateCommitteesService } from './efile.api/update.committes.service';
import { CandidatesUpdateService } from './efile.api/candidates.update.service';
import { CandidatesInfoUpdateService } from './efile.api/candidates-info.update.service';
import { CandidateCommitteeService } from '@app/sdvv-database/process.data/candidate.committee.service';
import { TransactionsXLSXService } from './transactions.xlsx/transactions.xlsx.service';
import { DeduplicateExpendituresService } from '@app/sdvv-database/process.data/deduplicate-expenditures.service';
import { ZipCodeCSVService } from './zip.code.csv/zip.code.csv.service';
import { JurisdictionZipCodeService } from './zip.code.csv/jurisdiction.zip.codes.service';

@Injectable()
export class UpdateCommandService {
  constructor(
    private typeOrmHealthIndicator: TypeOrmHealthIndicator,
    private electionsUpdateService: ElectionsUpdateService,
    private updateCommitteesService: UpdateCommitteesService,
    private candidateCommitteeService: CandidateCommitteeService,
    private candidatesUpdateService: CandidatesUpdateService,
    private candidatesInfoUpdateService: CandidatesInfoUpdateService,
    private transactionsXLSXService: TransactionsXLSXService,
    private deduplicateExpendituresService: DeduplicateExpendituresService,
    private zipCodeCSVService: ZipCodeCSVService,
    private jurisdictionZipCodeService: JurisdictionZipCodeService,
  ) {}

  async runCommand(): Promise<void> {
    const command = process.env.COMMAND;
    console.log({ command });

    switch (command) {
      case 'database-health-check':
        const status = await this.typeOrmHealthIndicator.pingCheck('database');
        console.log(status);
        break;

      case 'update-elections':
        await this.electionsUpdateService.updateElections();
        break;

      case 'update-candidates-current':
        await this.updateCommitteesService.updateCommittees();
        await this.candidatesUpdateService.updateCandidatesCurrent();
        await this.candidateCommitteeService.addCandidateCommittees();
        await this.candidatesInfoUpdateService.updateCandidatesInfo();
        break;

      case 'update-candidates-past':
        await this.updateCommitteesService.updateCommittees();
        await this.candidatesUpdateService.updateCandidatesPast();
        await this.candidateCommitteeService.addCandidateCommittees();
        await this.candidatesInfoUpdateService.updateCandidatesInfo();
        break;

      case 'update-candidates-info':
        await this.candidatesUpdateService.updateCandidatesCurrent();
        await this.candidatesUpdateService.updateCandidatesPast();
        await this.candidatesInfoUpdateService.updateCandidatesInfo();
        break;

      case 'update-transactions-current':
        await this.transactionsXLSXService.updateTransactionsCurrent();
        await this.deduplicateExpendituresService.removeDuplicateIndependentExpenditures();
        break;

      case 'update-transactions-past':
        await this.transactionsXLSXService.updateTransactionsPast();
        await this.deduplicateExpendituresService.removeDuplicateIndependentExpenditures();
        break;

      case 'update-zip-codes':
        await this.zipCodeCSVService.populateDatabaseWithZipCodes();
        await this.jurisdictionZipCodeService.populateDatabaseWithJurisdictionZipCodes();
        break;

      case 'initialize-data':
        await this.electionsUpdateService.updateElections();

        await this.updateCommitteesService.updateCommittees();
        await this.candidatesUpdateService.updateCandidatesCurrent();
        await this.candidatesUpdateService.updateCandidatesPast();
        await this.candidateCommitteeService.addCandidateCommittees();
        await this.candidatesInfoUpdateService.updateCandidatesInfo();

        await this.transactionsXLSXService.updateTransactionsCurrent();
        await this.transactionsXLSXService.updateTransactionsPast();
        await this.deduplicateExpendituresService.removeDuplicateIndependentExpenditures();

        await this.zipCodeCSVService.populateDatabaseWithZipCodes();
        await this.jurisdictionZipCodeService.populateDatabaseWithJurisdictionZipCodes();
        break;

      case '':
        console.log('Warning: no command provided!');
        return;

      default:
        console.log(`Error: did not recognize command: '${command}'!`);
        return;
    }

    console.log(`Completed: ${command}`);
  }
}
