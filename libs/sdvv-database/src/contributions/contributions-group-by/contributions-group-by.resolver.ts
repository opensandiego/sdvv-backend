import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ContributionsGroupByService } from './contributions-group-by.service';

@Resolver('ContributionsGroupBy')
export class ContributionsGroupByResolver {
  constructor(
    private contributionsGroupByService: ContributionsGroupByService,
  ) {}

  @ResolveField()
  async occupation(@Parent() contributions, @Args('limit') limit) {
    const { committeeName } = contributions;

    const list =
      await this.contributionsGroupByService.getContributionsByOccupation({
        committeeName,
        limit,
      });

    return list;
  }

  @ResolveField()
  async employer(@Parent() contributions, @Args('limit') limit) {
    const { committeeName } = contributions;

    const list =
      await this.contributionsGroupByService.getContributionByEmployer({
        committeeName,
        limit,
      });

    return list;
  }

  @ResolveField()
  async zipCode(@Parent() contributions, @Args('limit') limit) {
    const { committeeName } = contributions;

    const list = await this.contributionsGroupByService.getContributionByZip({
      committeeName,
      limit,
    });

    return list;
  }

  @ResolveField()
  async individual(@Parent() contributions, @Args('limit') limit) {
    const { committeeName } = contributions;

    const list =
      await this.contributionsGroupByService.getContributionByContributor({
        committeeName,
        limit,
      });

    return list;
  }
}
