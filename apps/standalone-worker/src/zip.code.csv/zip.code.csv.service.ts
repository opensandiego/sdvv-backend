import { Injectable } from '@nestjs/common';
import { CreateZipCodeDto } from '@app/sdvv-database/zipCodes/dto/createZipCode.dto';
import { ZipCodesService } from '@app/sdvv-database/zipCodes/zipCodes.service';
import { UtilsService } from '../utils/utils.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const XLSX = require('xlsx');

@Injectable()
export class ZipCodeCSVService {
  constructor(
    private utilsService: UtilsService,
    private zipCodesService: ZipCodesService,
  ) {}

  async populateDatabaseWithZipCodes() {
    try {
      const workbook = this.getWorkbook();

      const zipCodeClasses = await this.utilsService.getValidatedClass(
        workbook.SheetNames[0],
        workbook,
        CreateZipCodeDto,
      );

      await this.zipCodesService.createBulkZipCode(zipCodeClasses);
    } catch {
      console.log('Error in populateDatabaseWithZipCodes');
    }
  }

  private getWorkbook() {
    const csvFilePath = __dirname + '/assets/zip_code_database_2021.csv';
    try {
      return XLSX.readFile(csvFilePath);
    } catch (error) {
      console.log('File not found: ', csvFilePath);
      throw error;
    }
  }
}
