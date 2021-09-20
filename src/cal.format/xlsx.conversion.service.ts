import { catchError, map, mergeMap, Observable, of } from 'rxjs';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const XLSX = require('xlsx');

import { CreateF460AContribsDto } from './dto/createF460AContribs.dto';

export class XLSXTransformService {
  async processWorkbook(workbook) {
    const sheetJSON = this.getObjectRows(workbook, 'F460-D-ContribIndepExpn');

    const sheetClasses = await this.getValidatedClasses(
      sheetJSON.slice(0, 3),
      CreateF460AContribsDto,
    );
    console.log('sheetClasses', sheetClasses);
  }

  getObjectRows(workbook, sheetName: string) {
    const worksheet = workbook.Sheets[sheetName];
    const headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    const lowerCaseHeaders = headers[0].map((header) => header.toLowerCase());

    return XLSX.utils.sheet_to_json(worksheet, {
      header: lowerCaseHeaders,
      range: 1,
    });
  }

  async getValidatedClasses(objects, dto) {
    const classes = plainToClass(dto, objects);
    const count = await this.validateArray(classes);

    if (count > 0) {
      // console.log('validation failed. errors: ', errors);
      console.log('validation failed. errors: ');
      console.log('validation error count: ', count);
      throw 'Error: class validation failed';
    } else {
      console.log('validation succeed');
      return classes;
    }
  }

  async validateArray(items) {
    let errorCount = 0;
    for await (const item of items) {
      validate(item).then((errors) => {
        errorCount += errors.length;
      });
    }
    return errorCount;
  }
}
