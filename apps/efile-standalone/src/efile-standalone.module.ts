import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { HttpModule } from '@nestjs/axios';
import { CalDataModule } from '@app/cal-data';
import { EFileStandaloneService } from './efile-standalone.service';
import { XLSXModule } from './xlsx/xlsx.module';
import { F460DModule } from '@app/cal-data/f460d/f460d.module';
import { ZipCodeCSVModule } from './zip.code.csv/zip.code.csv.module';

@Module({
  imports: [
    XLSXModule,
    ZipCodeCSVModule,
    CalDataModule,
    F460DModule,
    BullModule.forRoot({
      // configure this for production
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    HttpModule,
  ],
  providers: [EFileStandaloneService],
  exports: [],
})
export class EFileStandaloneModule {}
