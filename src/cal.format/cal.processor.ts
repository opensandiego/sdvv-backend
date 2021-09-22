import { Job, DoneCallback } from 'bull';
import {
  bufferCount,
  catchError,
  concatAll,
  concatMap,
  EMPTY,
  map,
  mergeMap,
  Observable,
  of,
  toArray,
} from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { XLSXDownloadService } from './xlsx.download.service';
import { XLSXTransformService } from './xlsx.conversion.service';

const httpService = new HttpService();
const eFileBulkDownloadService = new XLSXDownloadService(httpService);
const xlsxTransformService = new XLSXTransformService();

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
        console.log('Error: in updated from eFile bulk download');
        return doneCallback(null, 'Error running task');
      }),
    )
    .subscribe(() => doneCallback(null, 'Task finished'));
}

function dispatchJob(jobData): Observable<any> {
  if (jobData['update'] === 'sup-opp') {
    console.log(`Transactions sup-opp: started`);
    return updateTransactionsSupOpp(jobData['year']).pipe(
      map(() => console.log(`Transactions sup-opp: complete`)),
    );
  } else if (jobData['update'] === 'xlsx') {
    console.log(`update from xlsx: started`);
    return of(jobData['year']).pipe(
      mergeMap((year) => updateFromXLSXFile(year)),
      // map(
      //   async (workbook) =>
      //     await xlsxTransformService.processWorkbook(workbook),
      // ),
    );
  } else {
    console.log('No valid update requested');
    console.log(jobData);
    return EMPTY;
  }
}

export function updateFromXLSXFile(year): Observable<any> {
  return eFileBulkDownloadService.getXLSXFile(year).pipe(
    catchError(() => {
      console.log('Error getting workbook from XLSX file');
      return 'error';
    }),

    map(
      async (workbook) => await xlsxTransformService.processWorkbook(workbook),
    ),
    catchError(() => {
      console.log('Error processing XLSX workbook');
      return 'error';
    }),
  );
}

function updateTransactionsSupOpp(year: number) {
  const maxTransactionsPerPost = 5000;

  return eFileBulkDownloadService.downloadBulkExport(year).pipe(
    catchError((error) => {
      console.log('Error getting bulk transactions from eFile');
      throw error;
    }),
    concatAll(),
    bufferCount(maxTransactionsPerPost),
    // concatMap((transactions) =>
    //   httpService.post(`${host}/transactions/bulk`, transactions),
    // ),
    toArray(),
    catchError((error) => {
      console.log('Error posting bulk transactions to database');
      throw error;
    }),
  );
}
