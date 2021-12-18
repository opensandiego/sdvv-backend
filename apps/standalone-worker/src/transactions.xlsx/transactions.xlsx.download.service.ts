import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const XLSX = require('xlsx');
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class TransactionsXLSXDownloadService {
  constructor(
    private httpService: HttpService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

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
      this.logger.log({
        level: 'error',
        message: 'Not able to read sheet from Uint8Array data.',
        sheetName: worksheetName,
      });
      throw error;
    }
  }

  private getDownloadURL(year: number, mostRecent = false): Observable<string> {
    const requestUrl = `${this.eFileBulkExportUrl}?year=${year}&most_recent_only=${mostRecent}`;

    return this.httpService.get(requestUrl).pipe(
      map((axiosResponse) => axiosResponse.data),
      map((eFileResponse) => eFileResponse.data),
      catchError((error) => {
        this.logger.log({
          level: 'error',
          message: 'Not able to get URL of XLSX file from eFile.',
          year: year,
          url: requestUrl,
        });

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
        this.logger.log({
          level: 'error',
          message: 'Not able to download XLSX file.',
          url: requestUrl,
        });
        throw error;
      }),
      map((response) => response.data),
    );
  }

  private convertToUint8Array(data: ArrayBuffer): Observable<Uint8Array> {
    return of(data).pipe(
      map((data) => new Uint8Array(data)),
      catchError((error) => {
        this.logger.log({
          level: 'error',
          message: 'Not able to convert data from ArrayBuffer to Uint8Array.',
        });
        throw error;
      }),
    );
  }
}
