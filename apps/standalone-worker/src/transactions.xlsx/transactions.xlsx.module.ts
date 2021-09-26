import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CalDataModule } from '@app/cal-data';
import { F460DModule } from '@app/cal-data/f460d/f460d.module';
import { UtilsModule } from '../utils/utils.module';
import { TransactionsXLSXService } from './transactions.xlsx.service';
import { TransactionsXLSXDownloadService } from './transactions.xlsx.download.service';

@Module({
  imports: [CalDataModule, F460DModule, UtilsModule, HttpModule],
  providers: [TransactionsXLSXService, TransactionsXLSXDownloadService],
  exports: [TransactionsXLSXService],
})
export class TransactionsXLSXModule {}
