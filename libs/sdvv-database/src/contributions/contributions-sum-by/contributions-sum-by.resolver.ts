import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ContributionsSumByJurisdictionService } from '../contributions-sum-by-jurisdiction/contributions-sum-by-jurisdiction.service';

@Resolver('ContributionsSumBy')
export class ContributionsSumByResolver {
  constructor(
    private contributionsSumByJurisdictionService: ContributionsSumByJurisdictionService,
  ) {}

  /**
   * jurisdiction: returns an object with inside and outside fields
   * It is resolved here rather than in its own class with individual
   * resolvers since the inside and outside fields share multiple
   * database calls.
   */
  @ResolveField()
  async jurisdiction(@Parent() contributions) {
    const { committeeName } = contributions;

    const sums =
      await this.contributionsSumByJurisdictionService.getJurisdictionSums({
        committeeName,
      });

    return sums;
  }

  @ResolveField()
  async method(@Parent() contributions) {
    const { committeeName } = contributions;
    return { committeeName };
  }

  @ResolveField()
  async location(@Parent() contributions) {
    const { committeeName } = contributions;
    return { committeeName };
  }
}
