import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ElectionYearsService } from './election-years.service';
import { ElectionService } from './election/election.service';

@Resolver('ElectionYear')
export class ElectionYearsResolver {
  constructor(
    private electionYearsService: ElectionYearsService,
    private electionService: ElectionService,
  ) {}

  @Query()
  async electionYears(@Args('year') year: string) {
    if (year) {
      return [{ year }];
    }

    const result = await this.electionYearsService.getYears();

    return result;
  }

  @ResolveField()
  async elections(@Parent() parent) {
    const { year } = parent;

    const result = await this.electionService.getElections(year);

    return result;
  }

  // @ResolveField()
  // async offices(@Parent() parent) {
  //   const { year } = parent;
  //   return { year };
  // }
}
