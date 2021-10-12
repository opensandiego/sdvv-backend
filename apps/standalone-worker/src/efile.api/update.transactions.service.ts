import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  catchError,
  concatAll,
  concatMap,
  EMPTY,
  expand,
  firstValueFrom,
  from,
  map,
  Observable,
  toArray,
} from 'rxjs';
import { ClassValidationService } from '../utils/utils.class.validation.service';
import {
  EFileTransactionResponse,
  Transaction,
} from './models/transaction.interface';
import { SharedService } from '@app/sdvv-database/shared/shared.service';
import { CreateTransactionDto } from '@app/efile-api-data/tables/dto/createTransaction.dto';
import { TransactionEntity } from '@app/efile-api-data/tables/entity/transactions.entity';

interface DateRange {
  begin: string;
  end: string;
}

@Injectable()
export class UpdateTransactionsService {
  constructor(
    private httpService: HttpService,
    private classValidationService: ClassValidationService,
    private sharedService: SharedService,
  ) {}

  private eFileTransactionUrl =
    'https://efile.sandiego.gov/api/v1/public/campaign-search/advanced';

  async updateTransactions(oldestDate: string, newestDate: string) {
    try {
      await this.downloadUpdateTransactions(oldestDate, newestDate);
      console.log('Update Transactions Complete');
    } catch {
      console.error('Error updating Transactions');
    }
  }

  async downloadUpdateTransactions(oldestDate: string, newestDate: string) {
    const transactions = await firstValueFrom(
      this.getUniqueTransactions(oldestDate, newestDate),
    );

    const classes = await this.classValidationService.getValidatedClasses(
      transactions,
      CreateTransactionDto,
    );

    await this.sharedService.createBulkData(classes, TransactionEntity);
  }

  getUniqueTransactions(
    oldestDate: string,
    newestDate: string,
  ): Observable<Transaction[]> {
    return this.getTransactionsInIntervals(oldestDate, newestDate).pipe(
      catchError((error) => {
        console.log('Error getting transactions from eFile');
        throw error;
      }),
      map((transactions): Transaction[] =>
        this.removeDuplicateTransactions(transactions),
      ),
      concatAll(),
      toArray(),
    );
  }

  private getTransactionsInIntervals(
    oldestDateStr: string,
    newestDateStr: string,
  ) {
    const oldestDate = new Date(oldestDateStr);
    const newestDate = new Date(newestDateStr);
    const ranges: DateRange[] = this.getDateRanges(oldestDate, newestDate);

    return from(ranges).pipe(
      concatMap((range) =>
        this.getAllTransactionsInDateRange(range.begin, range.end),
      ),
      concatAll(),
      toArray(),
    );
  }

  private getAllTransactionsInDateRange(
    oldestDate: string,
    newestDate: string,
    pageSize = 8000,
  ) {
    const source = this.downloadTransactions(
      oldestDate,
      newestDate,
      1,
      pageSize,
    );

    return source.pipe(
      expand((response) => {
        const currentPage = +response['page_number'];
        const endCondition = response.data.length < 1;
        return endCondition
          ? EMPTY
          : this.downloadTransactions(
              oldestDate,
              newestDate,
              currentPage + 1,
              pageSize,
            );
      }),
      map((response) => <Transaction[]>response.data),
      concatAll(),
      toArray(),
    );
  }

  private downloadTransactions(
    oldestISODate: string,
    newestISODate: string,
    pageNumber = 1,
    pageSize = 8000,
  ): Observable<EFileTransactionResponse> {
    const queryStr = `&transaction_name=&transaction_type=&most_recent_amendment=false&search_boolean_expression=false&filer_name=`;
    const parameters = `&start_date=${oldestISODate}&end_date=${newestISODate}&page_size=${pageSize}&page_number=${pageNumber}`;

    return this.httpService
      .get(`${this.eFileTransactionUrl}?query=${queryStr}${parameters}`)
      .pipe(
        catchError((error) => {
          console.log('Error downloading transactions from eFile');
          throw error;
        }),
        map((response) => response.data),
      );
  }

  private getDateRanges(
    oldestDate: Date,
    newestDate: Date,
    incrementInDays = 15,
  ): DateRange[] {
    if (incrementInDays < 1) {
      return [];
    }

    const dateRanges = [];
    const dateAccumulator = new Date(oldestDate.getTime());

    while (dateAccumulator < newestDate) {
      const startStr = dateAccumulator.toISOString();
      dateAccumulator.setDate(dateAccumulator.getDate() + incrementInDays);
      const endStr =
        dateAccumulator > newestDate
          ? newestDate.toISOString()
          : dateAccumulator.toISOString();

      dateRanges.push({
        begin: startStr,
        end: endStr,
      });
    }

    return dateRanges;
  }

  private removeDuplicateTransactions(
    transactions: Transaction[],
  ): Transaction[] {
    const uniqueTransactions = [
      ...new Map(
        transactions.map((transaction) => [
          `${transaction.filing_id}|${transaction.tran_id}|${transaction.schedule}`,
          transaction,
        ]),
      ).values(),
    ];

    console.log('Total Transactions downloaded:', transactions.length);
    console.log('Unique Transactions downloaded:', uniqueTransactions.length);
    console.log('Difference:', transactions.length - uniqueTransactions.length);

    return uniqueTransactions;
  }
}
