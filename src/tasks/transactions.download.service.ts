import { Injectable } from '@nestjs/common';
import { EMPTY, from } from 'rxjs';
import { concatAll, concatMap, expand, map, toArray } from 'rxjs/operators';
import { EFileDownloadService } from './efile.download.service';
import { Transaction } from './models/transaction.interface';

interface DateRange {
  begin: string;
  end: string;
}

@Injectable()
export class TransactionsDownloadService {
  constructor(private eFileDownloadService: EFileDownloadService) {}

  public getTransactionsFromEFile(
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

  public removeDuplicateTransactions(
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

  private getAllTransactionsInDateRange(
    oldestDate: string,
    newestDate: string,
    pageSize = 8000,
  ) {
    const source = this.eFileDownloadService.downloadTransactions(
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
          : this.eFileDownloadService.downloadTransactions(
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
}
