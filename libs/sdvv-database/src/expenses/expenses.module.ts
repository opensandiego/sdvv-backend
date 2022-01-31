import { Module } from '@nestjs/common';
import { ExpensesResolver } from './expenses.resolver';
import { ExpensesService } from './expenses.service';
import { ExpensesGroupByResolver } from './expenses-group-by/expenses-group-by.resolver';
import { ExpensesGroupByService } from './expenses-group-by/expenses-group-by.service';

@Module({
  imports: [],
  providers: [
    ExpensesResolver,
    ExpensesService,
    ExpensesGroupByResolver,
    ExpensesGroupByService,
  ],
  exports: [ExpensesService],
})
export class ExpensesModule {}
