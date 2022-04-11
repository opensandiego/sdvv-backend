import { Module } from '@nestjs/common';
import { IndependentExpendituresService } from './Independent-expenditure-sums/independent-expenditures.service';
import { IndependentExpendituresResolver } from './independent-expenditures.resolver';
import { IndependentExpenditureSumsResolver } from './Independent-expenditure-sums/independent-expenditure-sums.resolver';
import { IndependentExpendituresByCommitteesResolver } from './Independent-expenditure-committees/Independent-expenditure-committees.resolver';
import { IndependentExpenditureCommitteesService } from './Independent-expenditure-committees/Independent-expenditure-committees.service';

@Module({
  imports: [],
  providers: [
    IndependentExpendituresService,
    IndependentExpendituresResolver,
    IndependentExpenditureSumsResolver,
    IndependentExpendituresByCommitteesResolver,
    IndependentExpenditureCommitteesService,
  ],
  exports: [],
})
export class IndependentExpendituresModule {}
