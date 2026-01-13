import { Inject, Injectable } from '@nestjs/common';
import { CreateZipCodeDto } from '@app/sdvv-database/zipCodes/dto/createZipCode.dto';
import { ZipCodesService } from '@app/sdvv-database/zipCodes/zipCodes.service';
import { UtilsService } from '../utils/utils.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const XLSX = require('xlsx');
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class ZipCodeCSVService {
  constructor(
    private utilsService: UtilsService,
    private zipCodesService: ZipCodesService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
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
      this.logger.info('Populating Database with All US Zip Codes Complete');
    } catch {
      this.logger.error('Populating Database with All US Zip Codes Failed');
    }
  }

  private getWorkbook() {
    const csvFilePath = __dirname + '/assets/zip_code_database_2021.csv';
    try {
      return XLSX.readFile(csvFilePath);
    } catch (error) {
      this.logger.error('Not able to read CSV Zip Code file.', {
        filePath: csvFilePath,
      });

      throw error;
    }
  }
}
