import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElectionEntity } from './entity/elections.entity';
import { CandidateEntity } from './entity/candidates.entity';
import { CommitteeEntity } from './entity/committees.entity';
import { FilingEntity } from './entity/filings.entity';
import { TransactionEntity } from './entity/transactions.entity';
import { TablesService } from './tables.sevice';
import { CalculationTransaction } from './entity/calculation.transactions.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ElectionEntity]),
    TypeOrmModule.forFeature([CommitteeEntity]),
    TypeOrmModule.forFeature([CandidateEntity]),
    TypeOrmModule.forFeature([FilingEntity]),
    TypeOrmModule.forFeature([TransactionEntity]),
    TypeOrmModule.forFeature([CalculationTransaction]),
  ],
  providers: [TablesService],
  exports: [],
})
export class TablesModule {}