import { Module } from '@nestjs/common';
import { CandidateModule } from '../candidate/candidate.module';
import { ElectionYearsResolver } from './election-years.resolver';
import { ElectionYearsService } from './election-years.service';
import { ElectionService } from './election/election.service';

@Module({
  imports: [CandidateModule],
  providers: [ElectionYearsResolver, ElectionYearsService, ElectionService],
  exports: [],
})
export class ElectionYearsModule {}
