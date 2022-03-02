import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CandidateQLService } from '../../candidate/candidate.service';
import { ContributionsDetailsService } from '../../contributions/contributions-details/contributions-details.service';

@Resolver('Office')
export class OfficeResolver {
  constructor(
    private candidateQLService: CandidateQLService,
    private contributionsDetailsService: ContributionsDetailsService,
  ) {}

  @ResolveField()
  async committeeCount(@Parent() parent) {
    const { committeeNames } = parent;
    const committeeCount = committeeNames.length;
    return committeeCount;
  }

  @ResolveField()
  async totalContributions(@Parent() parent) {
    const { committeeNames } = parent;

    const sum = await this.contributionsDetailsService.getContributionSum({
      committeeName: committeeNames,
    });

    return sum;
  }

  @ResolveField()
  async candidates(@Parent() parent) {
    const { electionYear, type } = parent;

    const candidates = await this.candidateQLService.getCandidates({
      electionYear,
      filters: { offices: [type] },
    });

    return candidates;
  }
}
