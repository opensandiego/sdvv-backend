import { Job, DoneCallback } from 'bull';
import { HttpService } from '@nestjs/axios';
import { map, mergeMap } from 'rxjs';
import { EFileDownloadService } from './efile.download.service';
import { DateRangeDto } from './dto/dateRange.dto';
import { TransactionsDownloadService } from './transactions.download.service';

const httpService = new HttpService();
const eFileDownloadService = new EFileDownloadService(httpService);
const transactionsDownloadService = new TransactionsDownloadService(
  eFileDownloadService,
);
const host = 'http://localhost:3000'; // In production obtain host from the environment

export default function (job: Job, doneCallback: DoneCallback) {
  try {
    dispatchJob(job.data);
  } catch (error) {
    console.log(`Error in update.processor`, error);
    doneCallback(null, 'Error running task');
  }

  doneCallback(null, 'Task complete');
}

function dispatchJob(jobData) {
  if (jobData['update'] === 'elections') {
    console.log(`Elections update: started`);
    updateElections().subscribe(() =>
      console.log(`Elections update: completed`),
    );
  } else if (jobData['update'] === 'committees') {
    console.log(`Committees update: started`);
    updateCommittees().subscribe(() =>
      console.log(`Committees update: completed`),
    );
  } else if (jobData['update'] === 'candidates') {
    console.log(`Candidates update: started`);
    updateCandidates(jobData['id']).subscribe(() =>
      console.log(`Candidates update: completed`),
    );
  } else if (jobData['update'] === 'filings') {
    console.log(`Filings update: started`);
    updateFilings(jobData['ranges']).subscribe(() =>
      console.log(`Filings update: completed`),
    );
  } else if (jobData['update'] === 'transactions') {
    console.log(`Transactions update: started`);
    updateTransactions(jobData['ranges']).subscribe(() =>
      console.log(`Transactions update: completed`),
    );
  } else if (jobData['check'] === 'task checked') {
    console.log(`Connection to task processor working.`);
  } else {
    console.log('No valid update requested');
    console.log(jobData);
  }
}

function updateElections() {
  return eFileDownloadService.downloadElections().pipe(
    mergeMap((elections) => {
      return httpService.post(`${host}/elections/bulk`, elections);
    }),
    map((response) => response.data),
  );
}

function updateCandidates(electionID: string) {
  return eFileDownloadService.downloadCandidates(electionID).pipe(
    mergeMap((candidates) => {
      return httpService.post(`${host}/candidates/bulk`, candidates);
    }),
    map((response) => response.data),
  );
}

function updateCommittees() {
  return eFileDownloadService.downloadCommittees().pipe(
    mergeMap((committees) => {
      return httpService.post(`${host}/committees/bulk`, committees);
    }),
    map((response) => response.data),
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
    );
}

function updateTransactions(dateRanges: DateRangeDto) {
  return transactionsDownloadService
    .getTransactionsFromEFile(dateRanges.oldestDate, dateRanges.newestDate)
    .pipe(
      map((transactions) =>
        transactionsDownloadService.removeDuplicateTransactions(transactions),
      ),
      mergeMap((transactions) =>
        httpService.post(`${host}/transactions/bulk`, transactions),
      ),
      map((response) => response.data),
    );
}
