import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CandidateQLService } from './candidate.service';

@Resolver('Candidates')
export class CandidatesResolver {
  constructor(private candidateQLService: CandidateQLService) {}

  @Query()
  async candidates(@Args('year') year: string) {
    const candidates = await this.candidateQLService.getCandidates({
      electionYear: year,
    });

    return candidates;
  }
}
