import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { HttpModule } from '@nestjs/axios';
import { CalDataModule } from '@app/cal-data';
import { F460DModule } from '@app/cal-data/f460d/f460d.module';
import { XLSXProcessor } from './xlsx.processor';
import { XLSXDownloadService } from './xlsx.download.service';
import { XLSXTransformService } from './xlsx.conversion.service';
import { UtilsModule } from '../utils/utils.module';

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
  providers: [XLSXProcessor, XLSXDownloadService, XLSXTransformService],
})
export class XLSXModule {}
