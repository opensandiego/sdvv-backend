import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { IndependentExpendituresService } from './independent-expenditures.service';

@Resolver('IndependentExpenditureSums')
export class IndependentExpenditureSumsResolver {
  constructor(
    private independentExpendituresService: IndependentExpendituresService,
  ) {}

  @ResolveField()
  async support(@Parent() candidate: { id: string }) {
    const { id } = candidate;

    const sum =
      await this.independentExpendituresService.getIndependentExpendituresSupOppSum({
        candidateId: id,
        supOppCd: 'SUPPORT',
      });

    return Math.round(sum);
  }

  @ResolveField()
  async oppose(@Parent() candidate: { id: string }) {
    const { id } = candidate;

    const sum =
      await this.independentExpendituresService.getIndependentExpendituresSupOppSum({
        candidateId: id,
        supOppCd: 'OPPOSE',
      });

    return Math.round(sum);
  }
}
