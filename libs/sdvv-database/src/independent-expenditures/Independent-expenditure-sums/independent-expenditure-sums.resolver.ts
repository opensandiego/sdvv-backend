import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { IndependentExpendituresService } from './independent-expenditures.service';

@Resolver('IndependentExpenditureSums')
export class IndependentExpenditureSumsResolver {
  constructor(
    private independentExpendituresService: IndependentExpendituresService,
  ) {}

  @ResolveField()
  async support(@Parent() candidate) {
    const { lastName, electionYear } = candidate;

    const sum = await this.independentExpendituresService.supportSum(
      lastName,
      electionYear,
    );

    return sum;
  }

  @ResolveField()
  async oppose(@Parent() candidate) {
    const { lastName, electionYear } = candidate;

    const sum = await this.independentExpendituresService.opposeSum(
      lastName,
      electionYear,
    );

    return sum;
  }
}
