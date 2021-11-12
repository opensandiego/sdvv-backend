import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { F460DService } from '@app/sdvv-database/f460d/f460d.service';
import { CreateF460DDto } from '@app/sdvv-database/f460d/dto/createF460D.dto';
import { TransactionsXLSXDownloadService } from './transactions.xlsx.download.service';
import { UtilsService } from '../utils/utils.service';
@Injectable()
export class TransactionsXLSXService {
  constructor(
    private transactionsXLSXDownloadService: TransactionsXLSXDownloadService,
    private f460DService: F460DService,
    private utilsService: UtilsService,
  ) {}

  async populateDatabaseWithXLSXWorksheets(year) {
    const workbookFileData: Uint8Array = await firstValueFrom(
      this.transactionsXLSXDownloadService.getWorkbookFileData(year, true),
    );

    const sheetCodes = ['F460-D'];

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

    await options.dbSheetService.createBulk(classes);
  }

  private worksheetLookup(shortName) {
    switch (shortName.toUpperCase()) {
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
