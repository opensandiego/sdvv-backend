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

  public getWorkbookFileData(
    fileYear: number,
    mostRecent = false,
  ): Observable<Uint8Array> {
    return of(fileYear).pipe(
      mergeMap((year) => this.getDownloadURL(year, mostRecent)),
      mergeMap((url) => this.downloadXLSXArrayBuffer(url)),
      mergeMap((data) => this.convertToUint8Array(data)),
    );
  }

  public readWorkbookSheet(data: Uint8Array, worksheetName: string) {
    try {
      return XLSX.read(data, {
        type: 'array',
        sheets: worksheetName,
      });
    } catch (error) {
      console.log(
        `Error reading sheet "${worksheetName}" from Uint8Array data`,
      );
      throw error;
    }
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

  private downloadXLSXArrayBuffer(requestUrl: string): Observable<ArrayBuffer> {
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

  private convertToUint8Array(data: ArrayBuffer): Observable<Uint8Array> {
    return of(data).pipe(
      map((data) => new Uint8Array(data)),
      catchError((error) => {
        console.log('Error converting download from ArrayBuffer to Uint8Array');
        throw error;
      }),
    );
  }
}
