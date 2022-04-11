import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { IndependentExpenditureCommitteesService } from './Independent-expenditure-committees.service';

@Resolver('IndependentExpendituresByCommittees')
export class IndependentExpendituresByCommitteesResolver {
  constructor(
    private independentExpenditureCommitteesService: IndependentExpenditureCommitteesService,
  ) {}

  @ResolveField()
  async support(@Parent() candidate) {
    const { lastName, electionYear } = candidate;

    const committees =
      await this.independentExpenditureCommitteesService.supportCommittees(
        lastName,
        electionYear,
      );

    return committees;
  }

  @ResolveField()
  async oppose(@Parent() candidate) {
    const { lastName, electionYear } = candidate;

    const committees =
      await this.independentExpenditureCommitteesService.opposeCommittees(
        lastName,
        electionYear,
      );

    return committees;
  }
}
