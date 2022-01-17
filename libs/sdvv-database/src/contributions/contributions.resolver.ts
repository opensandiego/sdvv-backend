import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ContributionsService } from './contributions.service';

@Resolver('Contributions')
export class ContributionsResolver {
  constructor(private contributionsService: ContributionsService) {}

  @Query()
  async contributions(@Args('committeeName') committeeName: string) {
    return { committeeName: committeeName, id: committeeName };
  }

  @ResolveField()
  async total(@Parent() contributions) {
    const { committeeName } = contributions;

    const total = await this.contributionsService.getContributionSum({
      committeeName: committeeName,
    });

    return total;
  }

  @ResolveField()
  async average(@Parent() contributions) {
    const { committeeName } = contributions;

    const average = await this.contributionsService.getContributionAverage({
      committeeName: committeeName,
    });

    return average;
  }

  @ResolveField()
  async count(@Parent() contributions) {
    const { committeeName } = contributions;

    const count = await this.contributionsService.getContributorCount({
      committeeName: committeeName,
    });

    return count;
  }
}
