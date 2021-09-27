import { Job, DoneCallback } from 'bull';
import { HttpService } from '@nestjs/axios';
import {
  bufferCount,
  catchError,
  concatAll,
  concatMap,
  EMPTY,
  map,
  mergeMap,
  Observable,
  toArray,
} from 'rxjs';
import { EFileDownloadService } from './efile.download.service';
import { DateRangeDto } from './dto/dateRange.dto';
import { TransactionsDownloadService } from './transactions.download.service';
import { Transaction } from './models/transaction.interface';

const httpService = new HttpService();
const eFileDownloadService = new EFileDownloadService(httpService);
const transactionsDownloadService = new TransactionsDownloadService(
  eFileDownloadService,
);
const host = 'http://localhost:3000'; // In production obtain host from the environment

export default function processJobs(job: Job, doneCallback: DoneCallback) {
  const start: Date = new Date();

  dispatchJob(job.data)
    .pipe(
      map(() =>
        console.info(
          'Execution time: %d',
          (new Date().valueOf() - start.valueOf()) / 1000,
          'seconds',
        ),
      ),
      catchError(() => {
        console.log('Error: preDispatchJob in updating processor');
        return doneCallback(null, 'Error running task');
      }),
    )
    .subscribe(() => doneCallback(null, 'Task finished'));
}

function dispatchJob(jobData): Observable<any> {
  if (jobData['update'] === 'elections') {
    // console.log(`Elections update: started`);
    // return updateElections().pipe(
    //   map(() => console.log(`Elections update: complete`)),
    // );
  } else if (jobData['update'] === 'committees') {
    console.log(`Committees update: started`);
    return updateCommittees().pipe(
      map(() => console.log(`Committees update: complete`)),
    );
    // } else if (jobData['update'] === 'candidates') {
    //   console.log(`Candidates update: started`);
    //   return updateCandidates(jobData['id']).pipe(
    //     map(() => console.log(`Candidates update: complete`)),
    //   );
  } else if (jobData['update'] === 'filings') {
    console.log(`Filings update: started`);
    return updateFilings(jobData['ranges']).pipe(
      map(() => console.log(`Filings update: complete`)),
    );
  } else if (jobData['update'] === 'transactions') {
    console.log(`Transactions update: started`);
    return updateTransactions(jobData['ranges']).pipe(
      map(() => console.log(`Transactions update: complete`)),
    );
  } else {
    console.log('No valid update requested');
    console.log(jobData);
    return EMPTY;
  }
}

// function updateElections() {
//   return eFileDownloadService.downloadElections().pipe(
//     mergeMap((elections) => {
//       return httpService.post(`${host}/elections/bulk`, elections);
//     }),
//     map((response) => response.data),
//     catchError((error) => {
//       console.log('Error updating elections');
//       throw error;
//     }),
//   );
// }

// function updateCandidates(electionID: string) {
//   return eFileDownloadService.downloadCandidates(electionID).pipe(
//     mergeMap((candidates) => {
//       return httpService.post(`${host}/candidates/bulk`, candidates);
//     }),
//     map((response) => response.data),
//     catchError((error) => {
//       console.log('Error updating candidates');
//       throw error;
//     }),
//   );
// }

function updateCommittees() {
  return eFileDownloadService.downloadCommittees().pipe(
    mergeMap((committees) => {
      return httpService.post(`${host}/committees/bulk`, committees);
    }),
    map((response) => response.data),
    catchError((error) => {
      console.log('Error updating committees');
      throw error;
    }),
  );
}

function updateFilings(dateRanges: DateRangeDto) {
  return eFileDownloadService
    .downloadFilings(
      new Date(dateRanges.oldestDate).toISOString(),
      new Date(dateRanges.newestDate).toISOString(),
    )
    .pipe(
      mergeMap((filings) => httpService.post(`${host}/filings/bulk`, filings)),
      map((response) => response.data),
      catchError((error) => {
        console.log('Error updating filings');
        throw error;
      }),
    );
}

function updateTransactions(dateRanges: DateRangeDto) {
  const maxTransactionsPerPost = 5000;

  return transactionsDownloadService
    .getTransactionsFromEFile(dateRanges.oldestDate, dateRanges.newestDate)
    .pipe(
      catchError((error) => {
        console.log('Error getting transactions from eFile');
        throw error;
      }),
      map((transactions): Transaction[] =>
        transactionsDownloadService.removeDuplicateTransactions(transactions),
      ),
      concatAll(),
      bufferCount(maxTransactionsPerPost),
      concatMap((transactions) =>
        httpService.post(`${host}/transactions/bulk`, transactions),
      ),
      toArray(),
      catchError((error) => {
        console.log('Error posting transactions to database');
        throw error;
      }),
    );
}
