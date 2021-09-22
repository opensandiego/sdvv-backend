import { HttpService } from '@nestjs/axios';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const XLSX = require('xlsx');

export class XLSXDownloadService {
  constructor(private httpService: HttpService) {}

  private eFileBulkExportUrl =
    'https://efile.sandiego.gov/api/v1/public/campaign-bulk-export-url';
  // 'https://efile.sandiego.gov/api/v1/public/campaign-bulk-export-url?year=2020&most_recent_only=false';

  public getXLSXFile(fileYear: number, mostRecent = false): Observable<any> {
    return of(fileYear).pipe(
      mergeMap((year) => this.getDownloadURL(year, mostRecent)),
      mergeMap((url) => this.downloadXLSXFile(url)),
      mergeMap((data) => this.getXLSXWorkbook(data)),
    );
  }

  private getDownloadURL(year: number, mostRecent = false): Observable<string> {
    console.log('IN getDownloadURL');

    const requestUrl = `${this.eFileBulkExportUrl}?year=${year}&most_recent_only=${mostRecent}`;

    return this.httpService.get(requestUrl).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.log('Error getting location of xlsx file from eFile');
        throw error;
      }),
    );
  }

  private downloadXLSXFile(requestUrl: string): Observable<any> {
    requestUrl =
      'https://efile-sd-public.s3.amazonaws.com/export/City_of_San_Diego_CAL_2020_all.xlsx';

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

  private getXLSXWorkbook(data: ArrayBuffer) {
    return of(data).pipe(
      map((data) => new Uint8Array(data)),
      map((data) => XLSX.read(data, { type: 'array' })),
      catchError((error) => {
        console.log('Error converting downloaded file to xlsx format');
        throw error;
      }),
    );
  }

  // downloadBulkExport(): Observable<Committee[]> {}
  downloadBulkExport(year: number, mostRecent = false) {
    console.log('IN downloadBulkExport');

    const requestUrl = `${this.eFileBulkExportUrl}?year=${year}&most_recent_only=${mostRecent}`;
    const temp =
      'https://efile-sd-public.s3.amazonaws.com/export/City_of_San_Diego_CAL_2020_all.xlsx';

    return this.httpService.get(requestUrl).pipe(
      map((response) => response.data),
      mergeMap((url) => {
        return this.httpService.get(temp, {
          responseType: 'arraybuffer',
          headers: {
            Accept: 'application/xlsx',
          },
        });
      }),
      catchError((error) => {
        console.log('Error downloading bulk export from eFile via AWS');
        throw error;
      }),
      map((response) => response.data),

      map((data) => new Uint8Array(data)),
      map((data) => XLSX.read(data, { type: 'array' })),
      catchError((error) => {
        console.log('Error converting downloaded data to xlsx');
        throw error;
      }),

      map((workbook) => workbook.Sheets['F460-D-ContribIndepExpn']),
      map((worksheet) => XLSX.utils.sheet_to_json(worksheet)),
      map((worksheetJSON) =>
        worksheetJSON.map((row) => ({
          e_filing_id: row.e_filing_id,
          tran_id: row.Tran_ID,
          schedule: row.Form_Type,
          sup_opp_cd: row.Supp_Opp_Cd,
        })),
      ),
      map((worksheetJSON) => {
        console.log('sheetJson', worksheetJSON.slice(0, 10));
        return worksheetJSON;
      }),
      // map((response) => console.log('downloadBulkExport response', response)),
    );
  }
}
