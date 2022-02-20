import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ContributionsSumByMethodService } from './contributions-sum-by-method.service';

@Resolver('ContributionsSumByMethod')
export class ContributionsSumByMethodResolver {
  constructor(
    private contributionsSumByMethodService: ContributionsSumByMethodService,
  ) {}

  @ResolveField()
  async inKind(@Parent() contributions) {
    const { committeeName } = contributions;

    const sum =
      await this.contributionsSumByMethodService.getContributionsInKindSum({
        committeeName,
      });

    return sum;
  }

  @ResolveField()
  async individual(@Parent() contributions) {
    const { committeeName } = contributions;

    const sum =
      await this.contributionsSumByMethodService.getContributionsIndividualSum({
        committeeName,
      });

    return sum;
  }

  @ResolveField()
  async other(@Parent() contributions) {
    const { committeeName } = contributions;

    const sum =
      await this.contributionsSumByMethodService.getContributionsOtherSum({
        committeeName,
      });

    return sum;
  }

  @ResolveField()
  async monetary(@Parent() contributions) {
    const { committeeName } = contributions;

    const sums =
      await this.contributionsSumByMethodService.getMonetaryContributionsByCode(
        {
          committeeName,
        },
      );

    return sums;
  }

  @ResolveField()
  async nonMonetary(@Parent() contributions) {
    const { committeeName } = contributions;

    const sums =
      await this.contributionsSumByMethodService.getNonMonetaryContributionsByCode(
        {
          committeeName,
        },
      );

    return sums;
  }
}
