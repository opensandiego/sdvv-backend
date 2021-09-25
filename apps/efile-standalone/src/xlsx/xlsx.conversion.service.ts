import { Injectable } from '@nestjs/common';
import { ClassValidationService } from '../utils/class.validation.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const XLSX = require('xlsx');

@Injectable()
export class XLSXTransformService {
  constructor(private classValidationService: ClassValidationService) {}

  async processWorksheet(
    worksheetName: string,
    workbook,
    dtoClass,
  ): Promise<typeof dtoClass[]> {
    const sheetJSON = this.getObjectRows(workbook, worksheetName);

    const sheetClasses = await this.classValidationService.getValidatedClasses(
      sheetJSON,
      dtoClass,
    );
    return sheetClasses;
  }

  private getObjectRows(workbook, sheetName: string) {
    const worksheet = workbook.Sheets[sheetName];
    const headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    const lowerCaseHeaders = headers[0].map((header) => header.toLowerCase());

    return XLSX.utils.sheet_to_json(worksheet, {
      header: lowerCaseHeaders,
      range: 1,
      defval: null,
    });
  }
}
