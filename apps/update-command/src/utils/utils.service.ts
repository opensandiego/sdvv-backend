import { Injectable } from '@nestjs/common';
import { ClassValidationService } from './utils.class.validation.service';
import { XLSXConversionService } from './xlsx.conversion.service';

@Injectable()
export class UtilsService {
  constructor(
    private classValidationService: ClassValidationService,
    private xlsxConversionService: XLSXConversionService,
  ) {}

  async getValidatedClass(
    worksheetName: string,
    workbook,
    dtoClass,
  ): Promise<(typeof dtoClass)[]> {
    const sheetJSON = this.xlsxConversionService.getObjectRows(
      workbook,
      worksheetName,
    );

    const sheetClasses = await this.classValidationService.getValidatedClasses(
      sheetJSON,
      dtoClass,
    );
    return sheetClasses;
  }
}
