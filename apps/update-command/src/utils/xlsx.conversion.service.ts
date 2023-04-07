import { Inject, Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const XLSX = require('xlsx');
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class XLSXConversionService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  public getObjectRows(
    workbook,
    sheetName: string,
    rawOption = false,
  ): Array<any> {
    try {
      const worksheet = workbook.Sheets[sheetName];

      const headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const lowerCaseHeaders = headers[0].map((header) => header.toLowerCase());

      return XLSX.utils.sheet_to_json(worksheet, {
        header: lowerCaseHeaders,
        range: 1,
        raw: rawOption,
        defval: null,
      });
    } catch {
      this.logger.error('Extracting json from XLSX sheet failed', {
        sheetName: sheetName,
      });
      throw `Error Extracting json from XLSX sheet: ${sheetName}`;
    }
  }
}
