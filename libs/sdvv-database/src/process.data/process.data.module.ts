import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from '@app/efile-api-data/tables/entity/transactions.entity';
import { FilingTransactionService } from './filing.transaction.service';
import { CandidateCommitteeService } from './candidate.committee.service';
import { UpdateIndepExpnService } from './update.indep.expn.service';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity])],
  providers: [
    UpdateIndepExpnService,
    CandidateCommitteeService,
    FilingTransactionService,
  ],
  exports: [
    UpdateIndepExpnService,
    CandidateCommitteeService,
    FilingTransactionService,
  ],
})
export class ProcessDataModule {}