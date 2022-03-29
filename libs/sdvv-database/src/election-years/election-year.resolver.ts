import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CandidateQLService } from '../candidate/candidate.service';
import { ElectionYearsService } from './election-years.service';
import { ElectionService } from './election/election.service';
import { ElectionYearParams } from './election-year.validator';

@Resolver('ElectionYear')
export class ElectionYearResolver {
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
  async electionYear(@Args() args: ElectionYearParams) {
    const { year: electionYear, filters } = args;

    const result = await this.electionYearsService.getYears({
      electionYear,
    });

    const resultWithFilters = {
      ...result[0],
      filters,
    };

    return resultWithFilters;
  }

  @ResolveField()
  async elections(@Parent() parent) {
    const { year: electionYear } = parent;

    const elections = await this.electionService.getElections({ electionYear });

    return elections;
  }

  @ResolveField()
  async candidates(@Parent() parent) {
    const { year: electionYear, filters } = parent;

    const candidates = await this.candidateQLService.getCandidates({
      electionYear,
      filters: filters,
    });

    return candidates;
  }

  @ResolveField()
  async officesByType(@Parent() parent) {
    return parent;
  }
}
