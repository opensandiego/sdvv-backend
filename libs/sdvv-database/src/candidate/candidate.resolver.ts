import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CandidateQLService } from './candidate.service';

@Resolver('Candidate')
export class CandidateResolver {
  constructor(private candidateQLService: CandidateQLService) {}

  @Query()
  async candidate(@Args('id') id: string) {
    const candidate = await this.candidateQLService.getCandidate({
      candidateId: id,
    });

    return candidate;
  }

  @ResolveField()
  async committee(@Parent() candidate) {
    const { committeeName } = candidate;
    return { name: committeeName };
  }
}
