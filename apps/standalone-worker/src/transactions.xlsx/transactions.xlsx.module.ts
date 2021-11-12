import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DatabaseModule } from '@app/sdvv-database';
import { F460AModule } from '@app/sdvv-database/f460a/f460a.module';
import { F460DModule } from '@app/sdvv-database/f460d/f460d.module';
import { UtilsModule } from '../utils/utils.module';
import { TransactionsXLSXService } from './transactions.xlsx.service';
import { TransactionsXLSXDownloadService } from './transactions.xlsx.download.service';

@Module({
  imports: [DatabaseModule, F460AModule, F460DModule, UtilsModule, HttpModule],
  providers: [TransactionsXLSXService, TransactionsXLSXDownloadService],
  exports: [TransactionsXLSXService],
})
export class TransactionsXLSXModule {}
