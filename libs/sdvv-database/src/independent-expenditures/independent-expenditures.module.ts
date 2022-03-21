import { Module } from '@nestjs/common';
import { IndependentExpendituresService } from './Independent-expenditure-sums/independent-expenditures.service';
import { IndependentExpendituresResolver } from './independent-expenditures.resolver';
import { IndependentExpenditureSumsResolver } from './Independent-expenditure-sums/independent-expenditure-sums.resolver';

@Module({
  imports: [],
  providers: [
    IndependentExpendituresService,
    IndependentExpendituresResolver,
    IndependentExpenditureSumsResolver,
  ],
  exports: [],
})
export class IndependentExpendituresModule {}
