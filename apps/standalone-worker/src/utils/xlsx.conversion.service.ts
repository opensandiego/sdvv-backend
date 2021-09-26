import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const XLSX = require('xlsx');

@Injectable()
export class XLSXConversionService {
  public getObjectRows(
    workbook,
    sheetName: string,
    rawOption = false,
  ): Array<any> {
    const worksheet = workbook.Sheets[sheetName];

    const headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    const lowerCaseHeaders = headers[0].map((header) => header.toLowerCase());

    return XLSX.utils.sheet_to_json(worksheet, {
      header: lowerCaseHeaders,
      range: 1,
      raw: rawOption,
      defval: null,
    });
  }
}
