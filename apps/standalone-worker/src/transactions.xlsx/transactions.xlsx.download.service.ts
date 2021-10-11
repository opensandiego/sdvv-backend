import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const XLSX = require('xlsx');

@Injectable()
export class TransactionsXLSXDownloadService {
  constructor(private httpService: HttpService) {}

  private eFileBulkExportUrl =
    'https://efile.sandiego.gov/api/v1/public/campaign-bulk-export-url';

  public getXLSXFile(
    fileYear: number,
    sheetName?: string,
    mostRecent = false,
  ): Observable<any> {
    return of(fileYear).pipe(
      mergeMap((year) => this.getDownloadURL(year, mostRecent)),
      mergeMap((url) => this.downloadXLSXFile(url)),
      mergeMap((data) => this.getXLSXWorkbook(data, sheetName)),
    );
  }

  private getDownloadURL(year: number, mostRecent = false): Observable<string> {
    console.log('IN getDownloadURL');

    const requestUrl = `${this.eFileBulkExportUrl}?year=${year}&most_recent_only=${mostRecent}`;

    return this.httpService.get(requestUrl).pipe(
      map((axiosResponse) => axiosResponse.data),
      map((eFileResponse) => eFileResponse.data),
      catchError((error) => {
        console.log('Error getting location of xlsx file from eFile');
        throw error;
      }),
    );
  }

  private downloadXLSXFile(requestUrl: string): Observable<any> {
    return of(requestUrl).pipe(
      mergeMap((url) => {
        return this.httpService.get(url, {
          responseType: 'arraybuffer',
          headers: {
            Accept: 'application/xlsx',
          },
        });
      }),
      catchError((error) => {
        console.log('Error downloading xlsx file');
        throw error;
      }),
      map((response) => response.data),
    );
  }

  private getXLSXWorkbook(data: ArrayBuffer, worksheetName?: string) {
    return of(data).pipe(
      map((data) => new Uint8Array(data)),
      map((data) => {
        return XLSX.read(data, {
          type: 'array',
          sheets: worksheetName,
        });
      }),
      catchError((error) => {
        console.log('Error converting downloaded file to xlsx format');
        throw error;
      }),
    );
  }
}
