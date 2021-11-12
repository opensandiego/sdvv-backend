import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { F460AService } from '@app/sdvv-database/f460a/f460a.service';
import { F460DService } from '@app/sdvv-database/f460d/f460d.service';
import { CreateF460ADto } from '@app/sdvv-database/f460a/f460a.dto';
import { CreateF460DDto } from '@app/sdvv-database/f460d/dto/createF460D.dto';
import { TransactionsXLSXDownloadService } from './transactions.xlsx.download.service';
import { UtilsService } from '../utils/utils.service';
@Injectable()
export class TransactionsXLSXService {
  constructor(
    private transactionsXLSXDownloadService: TransactionsXLSXDownloadService,
    private f460AService: F460AService,
    private f460DService: F460DService,
    private utilsService: UtilsService,
  ) {}

  async populateDatabaseWithXLSXWorksheets(year) {
    const workbookFileData: Uint8Array = await firstValueFrom(
      this.transactionsXLSXDownloadService.getWorkbookFileData(year, true),
    );

    const sheetCodes = ['F460-A', 'F460-D'];

    for await (const sheetCode of sheetCodes) {
      await this.processWorkbookSheet(workbookFileData, sheetCode, year);
    }
  }

  private async processWorkbookSheet(
    workbookFileData: Uint8Array,
    sheetCode: string,
    year: string,
  ) {
    const options = this.worksheetLookup(sheetCode);
    const workbookSheet =
      this.transactionsXLSXDownloadService.readWorkbookSheet(
        workbookFileData,
        options.sheetName,
      );

    const classes = await this.utilsService.getValidatedClass(
      options.sheetName,
      workbookSheet,
      options.dto,
    );

    classes.forEach((row) => {
      row['xlsx_file_year'] = year;
    });

    await options.dbSheetService.createBulk(classes);
  }

  private worksheetLookup(shortName) {
    switch (shortName.toUpperCase()) {
      case 'F460-A':
        return {
          sheetName: 'F460-A-Contribs',
          dto: CreateF460ADto,
          dbSheetService: this.f460AService,
        };
        break;
      case 'F460-D':
        return {
          sheetName: 'F460-D-ContribIndepExpn',
          dto: CreateF460DDto,
          dbSheetService: this.f460DService,
        };
        break;
      // case 'S496':
      //   return {
      //     sheetName: 'S496',
      //     dto: CreateS496DTO,
      //   };
      //   break;
      default:
        return null;
    }
  }
}
