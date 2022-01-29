import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CandidateQLService } from '../candidate/candidate.service';
import { ElectionYearsService } from './election-years.service';
import { ElectionService } from './election/election.service';

@Resolver('ElectionYear')
export class ElectionYearsResolver {
  constructor(
    private electionYearsService: ElectionYearsService,
    private electionService: ElectionService,
    private candidateQLService: CandidateQLService,
  ) {}

  @Query()
  async electionYears() {
    const result = await this.electionYearsService.getYears({});
    return result;
  }

  @Query()
  async electionYear(@Args() args) {
    const { year: electionYear } = args;

    const result = await this.electionYearsService.getYears({
      electionYear,
    });
    return result;
  }

  @ResolveField()
  async elections(@Parent() parent) {
    const { year: electionYear } = parent;

    const elections = await this.electionService.getElections({ electionYear });

    return elections;
  }

  @ResolveField()
  async candidates(@Parent() parent) {
    const { year: electionYear } = parent;

    const candidates = await this.candidateQLService.getCandidates({
      electionYear,
      filters: null,
    });

    return candidates;
  }

  @ResolveField()
  async officesByType(@Parent() parent) {
    return parent;
  }
}
