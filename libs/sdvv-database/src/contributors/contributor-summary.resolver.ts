import { Args, Query, Resolver } from '@nestjs/graphql';
import { ContributorService } from './contributor.service';

@Resolver('ContributorSummary')
export class ContributorSummaryResolver {
  constructor(private contributorService: ContributorService) {}

  @Query()
  async contributorSummary(
    @Args('committeeName') committeeName: string,
    @Args('limit') limit: number,
  ) {
    const list = await this.contributorService.getContributorSummary({
      committeeName,
      limit,
    });

    return list;
  }
}
