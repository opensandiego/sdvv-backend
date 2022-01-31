import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CandidateQLService } from './candidate.service';

@Resolver('Candidates')
export class CandidatesResolver {
  constructor(private candidateQLService: CandidateQLService) {}

  @Query()
  async candidates(@Args() args) {
    const { year } = args;
    const { filters } = args;

    const candidates = await this.candidateQLService.getCandidates({
      electionYear: year,
      filters: filters,
    });

    return candidates;
  }
}
