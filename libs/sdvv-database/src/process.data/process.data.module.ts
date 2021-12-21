import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from '@app/efile-api-data/tables/entity/transactions.entity';
import { CandidateCommitteeService } from './candidate.committee.service';
import { CandidateYearService } from './candidates.year.service';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity])],
  providers: [CandidateCommitteeService, CandidateYearService],
  exports: [CandidateCommitteeService, CandidateYearService],
})
export class ProcessDataModule {}
