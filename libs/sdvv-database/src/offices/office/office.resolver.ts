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
    const { electionYear, title } = parent;

    const committeeNames = await this.officesService.getCommitteeNames({
      electionYear,
      officeName: title,
    });

    let committeeCount = null;

    if (committeeNames.length > 0) {
      committeeCount = committeeNames.length;
    }

    return committeeCount;
  }

  @ResolveField()
  async totalContributions(@Parent() parent) {
    const { electionYear, title } = parent;

    const committeeNames = await this.officesService.getCommitteeNames({
      electionYear,
      officeName: title,
    });

    let sum = null;

    if (committeeNames.length > 0) {
      sum = await this.contributionsDetailsService.getContributionSum({
        committeeName: committeeNames,
      });
    }

    return sum;
  }

  @ResolveField()
  async candidates(@Parent() parent) {
    const { electionYear, title } = parent;

    const candidates = await this.candidateQLService.getCandidates({
      electionYear,
      filters: { offices: [title] },
    });

    return candidates;
  }
}
