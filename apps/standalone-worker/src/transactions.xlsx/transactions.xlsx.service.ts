import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { TransactionsXLSXDownloadService } from './transactions.xlsx.download.service';
import { RCPTService } from '@app/sdvv-database/tables-xlsx/rcpt/rcpt.service';
import { EXPNService } from '@app/sdvv-database/tables-xlsx/expn/expn.service';
import { XLSXConversionService } from '../utils/xlsx.conversion.service';
import { ElectionYears } from '../assets/elections';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class TransactionsXLSXService {
  constructor(
    private transactionsXLSXDownloadService: TransactionsXLSXDownloadService,
    private xlsxConversionService: XLSXConversionService,
    private rcptService: RCPTService,
    private expnService: EXPNService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  private sheetCAL = [
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

  public async updateTransactionsCurrent() {
    const currentElection = ElectionYears.find((election) => election.current);

    const years = this.getXLSXYears([currentElection.year]);

    try {
      for await (const year of years) {
        await this.populateDatabaseWithXLSXWorksheets(year);
      }
      this.logger.info('Update Transactions for Current Election Complete', {
        years: years,
      });
    } catch {
      this.logger.error('Updating Transactions for Current Election Failed', {
        years: years,
      });
    }
  }

  public async updateTransactionsPast() {
    const pastElections = ElectionYears.filter((election) => !election.current);

    const years = this.getXLSXYears(
      pastElections.map((election) => election.year),
    );

    try {
      for await (const year of years) {
        await this.populateDatabaseWithXLSXWorksheets(year);
        this.logger.info('Updated Transactions for Election', {
          year: year,
        });
      }
      this.logger.info('Update Transactions for all Past Elections Complete', {
        years: years,
      });
    } catch {
      this.logger.error('Update Transactions for all Past Elections Failed', {
        years: years,
      });
    }
  }

  private getXLSXYears(electionYear: number[]): string[] {
    const XLSXYears: number[] = [];

    electionYear.forEach((year) => {
      XLSXYears.push(year);
      XLSXYears.push(year - 1);
    });

    const uniqueYears = [...new Set(XLSXYears)];

    const today = new Date();
    const currentYear = today.getFullYear();

    const validYears = uniqueYears
      .filter((year) => year <= currentYear)
      .sort((a, b) => b - a);

    return validYears.map((year) => year.toString());
  }

  async populateDatabaseWithXLSXWorksheets(year) {
    const workbookFileData: Uint8Array = await firstValueFrom(
      this.transactionsXLSXDownloadService.getWorkbookFileData(year, true),
    );

    for await (const sheet of this.sheetCAL) {
      try {
        await this.processWorkbookSheet(workbookFileData, sheet, year);
      } catch {
        this.logger.error('Skipping Transactions for XLSX workbook sheet', {
          year: year,
          sheetName: sheet.sheetName,
        });
      }
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
