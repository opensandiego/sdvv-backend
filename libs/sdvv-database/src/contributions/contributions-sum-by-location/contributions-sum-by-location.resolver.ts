import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ContributionsSumByLocationService } from './contributions-sum-by-location.service';

@Resolver('ContributionsSumByLocation')
export class ContributionsSumByLocationResolver {
  constructor(
    private contributionsSumByLocationService: ContributionsSumByLocationService,
  ) {}

  @ResolveField()
  async inDistrict(@Parent() contributions) {
    const { committeeName } = contributions;

    const sum = await this.contributionsSumByLocationService.getDistrictSum({
      committeeName,
    });

    return sum;
  }

  @ResolveField()
  async inCity(@Parent() contributions) {
    const { committeeName } = contributions;

    const sum = await this.contributionsSumByLocationService.getCitySum({
      committeeName,
    });

    return sum;
  }

  @ResolveField()
  async inCounty(@Parent() contributions) {
    const { committeeName } = contributions;

    const sum = await this.contributionsSumByLocationService.getCountySum({
      committeeName,
    });

    return sum;
  }

  @ResolveField()
  async inState(@Parent() contributions) {
    const { committeeName } = contributions;

    const sum = await this.contributionsSumByLocationService.getStateSum({
      committeeName,
    });

    return sum;
  }

  @ResolveField()
  async outOfState(@Parent() contributions) {
    const { committeeName } = contributions;

    const sum = await this.contributionsSumByLocationService.getOutOfStateSum({
      committeeName,
    });

    return sum;
  }
}
