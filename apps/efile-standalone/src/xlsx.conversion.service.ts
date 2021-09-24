import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const XLSX = require('xlsx');

@Injectable()
export class XLSXTransformService {
  async processWorksheet(worksheetName: string, workbook, dtoClass) {
    const sheetJSON = this.getObjectRows(workbook, worksheetName);

    const sheetClasses = await this.getValidatedClasses(sheetJSON, dtoClass);
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

  async getValidatedClasses(objects, dto) {
    const classes = plainToClass(dto, objects);
    // console.log('Converted to Class.');

    const errors = await this.validateArray(classes);
    // console.log('Validation complete.');

    if (errors.length > 0) {
      // console.log('validation failed. errors: ', errors);
      console.log('validation failed.');
      console.log('validation error count: ', errors.length);
      return [];
    } else {
      console.log('validation succeed');
    }

    // console.log('getValidatedClasses finished.');
    return classes;
  }

  private async validateArray(items) {
    const errorArrays = [];
    for await (const item of items) {
      const validationErrors = await validate(item, {
        skipMissingProperties: true,
      });
      if (validationErrors.length > 0) {
        errorArrays.push(validationErrors);
      }
    }
    return errorArrays;
  }
}
