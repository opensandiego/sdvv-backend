import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { HttpModule } from '@nestjs/axios';
import { CalDataModule } from '@app/cal-data';
import { EFileStandaloneService } from './efile-standalone.service';
import { EFileProcessor } from './efile.processor';
import { XLSXDownloadService } from './xlsx.download.service';
import { XLSXTransformService } from './xlsx.conversion.service';
import { F460DModule } from '@app/cal-data/f460d/f460d.module';

@Module({
  imports: [
    CalDataModule,
    F460DModule,
    BullModule.forRoot({
      // configure this for production
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'cal-tasks', // OR 'eFile-tasks
    }),
    HttpModule,
  ],
  providers: [
    EFileStandaloneService,
    EFileProcessor,
    XLSXDownloadService,
    XLSXTransformService,
  ],
})
export class EFileStandaloneModule {}
