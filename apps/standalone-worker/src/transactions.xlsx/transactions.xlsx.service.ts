import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { firstValueFrom } from 'rxjs';
import { TransactionsXLSXDownloadService } from './transactions.xlsx.download.service';
import { RCPTService } from '@app/sdvv-database/tables-xlsx/rcpt/rcpt.service';
import { EXPNService } from '@app/sdvv-database/tables-xlsx/expn/expn.service';
import { S496Service } from '@app/sdvv-database/tables-xlsx/s496/s496.service';
import { XLSXConversionService } from '../utils/xlsx.conversion.service';
import { ElectionYears } from '../assets/elections';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
require('expose-gc');

@Injectable()
export class TransactionsXLSXService {
  constructor(
    private transactionsXLSXDownloadService: TransactionsXLSXDownloadService,
    private xlsxConversionService: XLSXConversionService,
    private rcptService: RCPTService,
    private expnService: EXPNService,
    private s496Service: S496Service,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private sheetCAL = [
    {
      // Schedule A "Monetary Contributions" of Form 460
      sheetName: 'F460-A-Contribs',
      formType: 'A',
      serviceType: this.rcptService,
    },
    {
      // Schedule C "Non-Monetary Contributions" of Form 460
      sheetName: 'F460-C-Contribs',
      formType: 'C',
      serviceType: this.rcptService,
    },
    {
      // Schedule I "Miscellaneous Increases in Cash" of Form 460
      sheetName: 'F460-I-MiscCashIncs',
      formType: 'I',
      serviceType: this.rcptService,
    },
    {
      // Part 3 of Form 496
      sheetName: 'F496-P3-Contribs',
      formType: 'F496P3',
      serviceType: this.rcptService,
    },
    {
      // Schedule D "Summary of Expenditures Supporting/Opposing Other Candidates, Measures, and Committees" of Form 460
      sheetName: 'F460-D-ContribIndepExpn',
      formType: 'D',
      serviceType: this.expnService,
    },
    {
      // Schedule E "Payments Made" of Form 460
      sheetName: 'F460-E-Expenditures',
      formType: 'E',
      serviceType: this.expnService,
    },
    {
      // Schedule G "Payments Made by an Agent or Independent Contractor" of Form 460
      sheetName: 'F460-G-AgentPayments',
      formType: 'G',
      serviceType: this.expnService,
    },
    // {
    //  // Schedule F "Accrued Expenses (Unpaid Bills)" of Form 460
    //   sheetName: 'F460-F-UnpaidBills',
    //   formType: 'F',
    //   serviceType: this.,
    // },
    // {
    //  // Schedule B1 "Loans Received" of Form 460
    //   sheetName: 'F460-B1-Loans',
    //   formType: 'B1',
    //   serviceType: this.,
    // },
    // {
    //  // Schedule B2 "Loans Guarantors" of Form 460
    //   sheetName: 'F460-B2-LoanGuarantees',
    //   formType: '',
    //   serviceType: this.,
    // },
    // {
    //  // Schedule H "Loans Made to Others" of Form 460
    //   sheetName: 'F460-H-LoansMade',
    //   formType: '',
    //   serviceType: this.,
    // },
    // {
    //  // Summary page of Form 460 and on the summary sheets of Form 460 schedules
    //   sheetName: 'F460-Summary',
    //   formType: '', // Multiple
    //   serviceType: this.,
    // },
    {
      // Form 496, Parts 1 and 2
      // 496 24-Hour/10-Day Independent Expenditure Report
      sheetName: 'S496',
      formType: 'F496',
      serviceType: this.s496Service,
    },
    // {
    // // Form 497, Parts 1 and 2
    // 497 24-hour/10-day Contribution Report
    //   sheetName: 'S497',
    //   formType: 'F497P1', // also F497P2
    //   serviceType: this.,
    // },
    // {
    // // "TEXT" records on Forms 460, 496, and 497
    //   sheetName: 'TEXT',
    //   formType: '', // Multiple
    //   serviceType: this.,
    // },
  ];

  public async updateTransactionsCurrent() {
    const currentElection = ElectionYears.find((election) => election.current);

    const years = this.getXLSXYears([currentElection.year]);

    try {
      for await (const year of years) {
        await this.populateDatabaseWithXLSXWorksheets(year);
      }

      await this.setLastUpdatedDateTime();

      this.logger.info('Update Transactions for Current Election Complete', {
        transactionYears: years,
        electionYear: currentElection.year,
      });
    } catch {
      this.logger.error('Updating Transactions for Current Election Failed', {
        transactionYears: years,
        electionYear: currentElection.year,
      });
    }
  }

  private async setLastUpdatedDateTime() {
    const dateTimeNow = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'short',
    }).format(new Date());

    await this.cacheManager.set('last-updated-date-time', dateTimeNow, {
      ttl: 0,
    });
  }

  public async getLastUpdatedDateTime(): Promise<string> {
    return await this.cacheManager.get('last-updated-date-time');
  }

  public async updateTransactionsPast() {
    const pastElections = ElectionYears.filter((election) => !election.current);

    const years = this.getXLSXYears(
      pastElections.map((election) => election.year),
    );

    try {
      for await (const year of years) {
        await this.populateDatabaseWithXLSXWorksheets(year);

        if (global.gc) {
          global.gc(); // Run Garbage Collection to free up memory on the Heap
        }

        this.logger.info('Updated Transactions', {
          transactionYear: year,
        });
      }
      this.logger.info('Update Transactions for all Past Elections Complete', {
        transactionYears: years,
      });
    } catch {
      this.logger.error('Update Transactions for all Past Elections Failed', {
        transactionYears: years,
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
        if (global.gc) {
          global.gc(); // Run Garbage Collection to free up memory on the Heap
        }
      } catch (e) {
        this.logger.error('Skipping Transactions for XLSX workbook sheet', {
          transactionYear: year,
          sheetName: sheet.sheetName,
        });
      }
    }
  }

  private getSheetJSON(workbookFileData, sheetName) {
    const workbookSheet =
      this.transactionsXLSXDownloadService.readWorkbookSheet(
        workbookFileData,
        sheetName,
      );

    return this.xlsxConversionService.getObjectRows(workbookSheet, sheetName);
  }

  private async processWorkbookSheet(
    workbookFileData: Uint8Array,
    sheet,
    year: string,
  ) {
    const sheetJSON = this.getSheetJSON(workbookFileData, sheet.sheetName);

    if (global.gc) {
      global.gc(); // Run Garbage Collection to free up memory on the Heap
    }

    await sheet.serviceType.replaceYearData(sheetJSON, year, sheet.formType);
  }
}
