import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ContributionsService } from './contributions.service';

@Resolver('Contributions')
export class ContributionsResolver {
  constructor(private contributionsService: ContributionsService) {}

  @Query()
  async contributions(@Args('committeeName') committeeName: string) {
    return committeeName;
  }

  @ResolveField()
  async id(@Parent() committeeName) {
    return committeeName;
  }

  @ResolveField()
  async committeeName(@Parent() committeeName) {
    return committeeName;
  }

  @ResolveField()
  async total(@Parent() committeeName) {
    const contributions = await this.contributionsService.getContributionSum({
      committeeName: committeeName,
    });

    return contributions;
  }

  @ResolveField()
  async average(@Parent() committeeName) {
    const average = await this.contributionsService.getContributionAverage({
      committeeName: committeeName,
    });

    return average;
  }

  @ResolveField()
  async count(@Parent() committeeName) {
    const count = await this.contributionsService.getContributorCount({
      committeeName: committeeName,
    });

    return count;
  }
}
