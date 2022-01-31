import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ExpensesGroupByService } from './expenses-group-by.service';

@Resolver('ExpensesGroupBy')
export class ExpensesGroupByResolver {
  constructor(private expensesGroupByService: ExpensesGroupByService) {}

  @ResolveField()
  async expenseByCode(@Parent() parent, @Args('limit') limit) {
    const { committeeName } = parent;

    const categories =
      await this.expensesGroupByService.getCategoriesBySpendingCode({
        committeeName,
        limit,
      });

    return categories;
  }
}
