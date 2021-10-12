import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { UpdateIndepExpnService } from '@app/sdvv-database/process.data/update.indep.expn.service';
import { CandidateCommitteeService } from '@app/sdvv-database/process.data/candidate.committee.service';
import { FilingTransactionService } from '@app/sdvv-database/process.data/filing.transaction.service';

@Processor('worker-process-data')
export class QueueConsumerProcess {
  constructor(
    private updateIndepExpnService: UpdateIndepExpnService,
    private candidateCommitteeService: CandidateCommitteeService,
    private filingTransactionService: FilingTransactionService,
  ) {}

  @Process('set-candidate-committees')
  async addCandidateCommittees() {
    console.log('Starting Candidate Committees Job');
    await this.candidateCommitteeService.addCandidateCommittees();
  }

  @Process('set-transactions-calculation-status')
  async processFilings() {
    console.log('Starting Set Transactions Calculation Status Job');
    await this.filingTransactionService.processAllFilings();
  }

  @Process('set-transactions-sup-opp')
  async setTransactionsSupOpp() {
    console.log('Starting Setting Support & Opposed on Transactions Job');
    await this.updateIndepExpnService.setTransactionsSupOpp();
  }
}
