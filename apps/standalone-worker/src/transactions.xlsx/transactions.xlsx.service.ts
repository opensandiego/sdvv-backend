import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { TransactionsXLSXDownloadService } from './transactions.xlsx.download.service';
import { RCPTService } from '@app/sdvv-database/tables-xlsx/rcpt/rcpt.service';
import { EXPNService } from '@app/sdvv-database/tables-xlsx/expn/expn.service';
import { XLSXConversionService } from '../utils/xlsx.conversion.service';
@Injectable()
export class TransactionsXLSXService {
  constructor(
    private transactionsXLSXDownloadService: TransactionsXLSXDownloadService,
    private xlsxConversionService: XLSXConversionService,
    private rcptService: RCPTService,
    private expnService: EXPNService,
  ) {}

  private sheetEXPN = [
    {
      sheetName: 'F460-A-Contribs',
      formType: 'A',
      serviceType: this.rcptService,
    },
    {
      sheetName: 'F460-C-Contribs',
      formType: 'C',
      serviceType: this.rcptService,
    },
    {
      sheetName: 'F460-I-MiscCashIncs',
      formType: 'I',
      serviceType: this.rcptService,
    },
    {
      sheetName: 'F496-P3-Contribs',
      formType: 'F496P3',
      serviceType: this.rcptService,
    },
    {
      sheetName: 'F460-D-ContribIndepExpn',
      formType: 'D',
      serviceType: this.expnService,
    },
    {
      sheetName: 'F460-E-Expenditures',
      formType: 'E',
      serviceType: this.expnService,
    },
    {
      sheetName: 'F460-G-AgentPayments',
      formType: 'G',
      serviceType: this.expnService,
    },
  ];

  async populateDatabaseWithXLSXWorksheets(year) {
    const workbookFileData: Uint8Array = await firstValueFrom(
      this.transactionsXLSXDownloadService.getWorkbookFileData(year, true),
    );

    for await (const sheet of this.sheetEXPN) {
      console.log(`Adding transactions from Sheet: ${sheet.sheetName}`);

      await this.processWorkbookSheet(workbookFileData, sheet, year);
    }
  }

  private async processWorkbookSheet(
    workbookFileData: Uint8Array,
    sheet,
    year: string,
  ) {
    const workbookSheet =
      this.transactionsXLSXDownloadService.readWorkbookSheet(
        workbookFileData,
        sheet.sheetName,
      );

    const sheetJSON = this.xlsxConversionService.getObjectRows(
      workbookSheet,
      sheet.sheetName,
    );

    await sheet.serviceType.replaceYearData(sheetJSON, year, sheet.formType);
  }
}
