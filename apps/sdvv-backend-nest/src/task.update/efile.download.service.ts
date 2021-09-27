import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { catchError, map, Observable } from 'rxjs';
// import { EFileElectionResponse, Election } from './models/election.interface';
import {
  Committee,
  EFileCommitteeResponse,
} from './models/committee.interface';
import {
  Candidate,
  EFileCandidateResponse,
  Office,
} from './models/candidate.interface';
import { EFileFilingResponse, Filing } from './models/filings.interface';
import { EFileTransactionResponse } from './models/transaction.interface';

@Injectable()
export class EFileDownloadService {
  constructor(private httpService: HttpService) {}

  // private eFileElectionUrl =
  //   'https://efile.sandiego.gov/api/v1/public/campaign-search/election/list';
  private eFileCommitteeUrl =
    'https://efile.sandiego.gov/api/v1/public/campaign-search/by-name';
  private eFileCandidateUrl =
    'https://efile.sandiego.gov/api/v1/public/campaign-search/candidate/list';
  private eFileFilingUrl =
    'https://efile.sandiego.gov/api/v1/public/campaign-search';
  private eFileTransactionUrl =
    'https://efile.sandiego.gov/api/v1/public/campaign-search/advanced';

  // downloadElections(): Observable<Election[]> {
  //   return this.httpService.get(this.eFileElectionUrl).pipe(
  //     catchError((error) => {
  //       console.log('Error downloading elections from eFile', error);
  //       throw new HttpException(error.response.data, error.response.status);
  //     }),
  //     map((response) => response.data),
  //     map((response: EFileElectionResponse) => response.data),
  //   );
  // }

  downloadCommittees(): Observable<Committee[]> {
    const url = `${this.eFileCommitteeUrl}?candidate_name=`;
    return this.httpService.get(url).pipe(
      catchError((error) => {
        console.log('Error downloading committees from eFile', error);
        throw new HttpException(error.response.data, error.response.status);
      }),
      map((response) => response.data),
      map(
        (response: EFileCommitteeResponse) => response.data['committee_list'],
      ),
    );
  }

  downloadCandidates(electionID: string): Observable<Candidate[]> {
    const url = `${this.eFileCandidateUrl}/${electionID}`;
    return this.httpService.get(url).pipe(
      catchError((error) => {
        console.log('Error downloading candidates from eFile', error);
        throw new HttpException(error.response.data, error.response.status);
      }),
      map((response) => response.data),
      map((response: EFileCandidateResponse) => response.data),
      map((offices: Office) => {
        const candidates: Candidate[] = [];
        for (const office in offices) {
          offices[office].forEach((candidate) => {
            candidates.push(candidate);
          });
        }
        return candidates;
      }),
    );
  }

  downloadFilings(
    oldestDate: string,
    newestDate: string,
  ): Observable<Filing[]> {
    const url = `${this.eFileFilingUrl}?start_date=${oldestDate}&end_date=${newestDate}`;

    return this.httpService.get(url).pipe(
      catchError((error) => {
        console.log('Error downloading filings from eFile', error);
        throw new HttpException(error.response.data, error.response.status);
      }),
      map((response) => response.data),
      map((response: EFileFilingResponse) => response.data),
    );
  }

  downloadTransactions(
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
          throw new HttpException(error.response.data, error.response.status);
        }),
        map((response) => response.data),
      );
  }
}
