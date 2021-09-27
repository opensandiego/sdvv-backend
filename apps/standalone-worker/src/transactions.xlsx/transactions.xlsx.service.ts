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

  populateDatabaseWithXLSXTransactions(year, sheet) {
    const options = this.worksheetLookup(sheet);
    if (!options) return;

    this.downloadValidateWorksheet(year, options).then(() =>
      console.log('Adding XLSX Transactions complete'),
    );
  }

  private async downloadValidateWorksheet(year, options) {
    const workbook = await firstValueFrom(
      this.transactionsXLSXDownloadService.getXLSXFile(year),
    );

    const classes = await this.utilsService.getValidatedClass(
      options.sheetName,
      workbook,
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

  // private processJobWithTimer(jobInput) {
  //   const start: Date = new Date();

  //   return this.processJob(jobInput).pipe(
  //     map(() =>
  //       console.info(
  //         'Execution time: %d',
  //         (new Date().valueOf() - start.valueOf()) / 1000,
  //         'seconds',
  //       ),
  //     ),
  //     catchError(() => {
  //       console.log('Error: in updated from eFile bulk download');
  //       return 'Error running task';
  //     }),
  //   );
  // }
}
