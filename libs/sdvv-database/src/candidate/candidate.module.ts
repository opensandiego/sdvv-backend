import { Module } from '@nestjs/common';
import { CandidateResolver } from './candidate.resolver';
import { CandidatesResolver } from './candidates.resolver';
import { CandidateQLService } from './candidate.service';

@Module({
  imports: [],
  providers: [CandidateResolver, CandidatesResolver, CandidateQLService],
  exports: [CandidateQLService],
})
export class CandidateModule {}
