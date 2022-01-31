import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ExpensesService } from './expenses.service';

@Resolver('Expenses')
export class ExpensesResolver {
  constructor(private expendituresService: ExpensesService) {}

  @ResolveField()
  async sum(@Parent() parent) {
    const { committeeName } = parent;

    const expenses = await this.expendituresService.getTotalSpent({
      committeeName: committeeName,
    });

    return expenses;
  }

  @ResolveField()
  async groupBy(@Parent() parent) {
    const { committeeName } = parent;
    return { committeeName };
  }
}
