import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ContributionService } from '../contribution/contribution.service';
import { ContributionsDetailsService } from './contributions-details.service';

@Resolver('ContributionDetails')
export class ContributionsDetailsResolver {
  constructor(
    private contributionsDetailsService: ContributionsDetailsService,
    private contributionService: ContributionService,
  ) {}

  @ResolveField()
  async sum(@Parent() committee) {
    const { committeeName } = committee;

    const total = await this.contributionsDetailsService.getContributionSum({
      committeeName: committeeName,
    });

    return total;
  }

  @ResolveField()
  async average(@Parent() committee) {
    const { committeeName } = committee;

    const average =
      await this.contributionsDetailsService.getContributionAverage({
        committeeName: committeeName,
      });

    return average;
  }

  @ResolveField()
  async count(@Parent() committee) {
    const { committeeName } = committee;

    const count = await this.contributionsDetailsService.getContributorCount({
      committeeName: committeeName,
    });

    return count;
  }

  @ResolveField()
  async groupBy(@Parent() committee) {
    const { committeeName } = committee;
    return { committeeName };
  }

  @ResolveField()
  async categorizedBy(@Parent() committee) {
    const { committeeName } = committee;
    return { committeeName };
  }

  @ResolveField()
  async transactions(@Parent() committee, @Args() args) {
    const { committeeName } = committee;
    const { filters } = args;
    const { limit } = args;

    const list = await this.contributionService.getContributions({
      committeeName: committeeName,
      filters: filters,
      limit: limit,
    });

    return list;
  }
}
