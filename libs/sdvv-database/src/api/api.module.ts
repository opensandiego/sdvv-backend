import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RCPTEntity } from '@app/sdvv-database/tables-xlsx/rcpt/rcpt.entity';
import { EXPNEntity } from '@app/sdvv-database/tables-xlsx/expn/expn.entity';
import { S496Entity } from '@app/sdvv-database/tables-xlsx/s496/s496.entity';
import { CandidateContributionsController } from './candidates/contributions/contributions.controller';
import { CandidateContributionsService } from './candidates/contributions/contributions.service';
import { CandidateIndependentExpendituresController } from './candidates/independent-expenditures/independent-expenditures.controller';
import { CandidateIndependentExpendituresService } from './candidates/independent-expenditures/independent-expenditures.service';
import { CandidateEntity } from '../candidate/candidates.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CandidateEntity]),
    TypeOrmModule.forFeature([RCPTEntity]),
    TypeOrmModule.forFeature([EXPNEntity]),
    TypeOrmModule.forFeature([S496Entity]),
  ],
  controllers: [
    CandidateContributionsController,
    CandidateIndependentExpendituresController,
  ],
  providers: [
    CandidateContributionsService,
    CandidateIndependentExpendituresService,
  ],
})
export class APIModule {}
