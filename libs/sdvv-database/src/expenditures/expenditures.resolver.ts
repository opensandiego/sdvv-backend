import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ExpendituresService } from './expenditures.service';

@Resolver('Expenditures')
export class ExpendituresResolver {
  constructor(private expendituresService: ExpendituresService) {}

  @Query()
  async expenditures(@Args('committeeName') committeeName: string) {
    return committeeName;
  }

  @ResolveField()
  async id(@Parent() committeeName) {
    return committeeName;
  }

  @ResolveField()
  async committeeName(@Parent() committeeName) {
    return committeeName;
  }

  @ResolveField()
  async total(@Parent() committeeName) {
    const expenses = await this.expendituresService.getTotalSpent({
      committeeName: committeeName,
    });

    return expenses;
  }

  @ResolveField()
  async categories(@Parent() committeeName) {
    const categories =
      await this.expendituresService.getCategoriesBySpendingCode(committeeName);

    return categories;
  }
}
