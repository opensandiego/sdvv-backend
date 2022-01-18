import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ContributionsSummaryService } from './contributions-summary.service';
import { ContributorsListService } from './contributors-list.service';

@Resolver('ContributionsSummary')
export class ContributionsSummaryResolver {
  constructor(
    private contributionsSummaryService: ContributionsSummaryService,
    private contributorsListService: ContributorsListService,
  ) {}

  @Query()
  async contributionsSummary(@Args('committeeName') committeeName: string) {
    return { committeeName: committeeName };
  }

  @ResolveField()
  async id(@Parent() contributions) {
    const { committeeName } = contributions;
    return committeeName;
  }

  @ResolveField()
  async byOccupation(@Parent() contributions, @Args('limit') limit) {
    const { committeeName } = contributions;

    const list =
      await this.contributorsListService.getContributionsByOccupation({
        committeeName,
        limit,
      });

    return list;
  }

  @ResolveField()
  async total(@Parent() contributions) {
    const { committeeName } = contributions;

    const total = await this.contributionsSummaryService.getContributionSum({
      committeeName: committeeName,
    });

    return total;
  }

  @ResolveField()
  async average(@Parent() contributions) {
    const { committeeName } = contributions;

    const average =
      await this.contributionsSummaryService.getContributionAverage({
        committeeName: committeeName,
      });

    return average;
  }

  @ResolveField()
  async count(@Parent() contributions) {
    const { committeeName } = contributions;

    const count = await this.contributionsSummaryService.getContributorCount({
      committeeName: committeeName,
    });

    return count;
  }
}
