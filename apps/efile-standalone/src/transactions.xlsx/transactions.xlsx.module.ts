import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { HttpModule } from '@nestjs/axios';
import { CalDataModule } from '@app/cal-data';
import { F460DModule } from '@app/cal-data/f460d/f460d.module';
import { UtilsModule } from '../utils/utils.module';
import { TransactionsXLSXProcessor } from './transactions.xlsx.processor';
import { TransactionsXLSXDownloadService } from './transactions.xlsx.download.service';

@Module({
  imports: [
    CalDataModule,
    F460DModule,
    UtilsModule,
    BullModule.registerQueue({
      name: 'cal-tasks', // OR 'eFile-tasks
    }),
    HttpModule,
  ],
  providers: [TransactionsXLSXProcessor, TransactionsXLSXDownloadService],
})
export class TransactionsXLSXModule {}
