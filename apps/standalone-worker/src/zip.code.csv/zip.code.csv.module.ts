import { ZipCodesModule } from '@app/cal-data/zipCodes/zipCodes.module';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { UtilsModule } from '../utils/utils.module';
import { ZipCodeCSVProcessor } from './zip.code.csv.processor.service';
import { ZipCodeCSVService } from './zip.code.csv.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'zip-csv-tasks',
    }),
    UtilsModule,
    ZipCodesModule,
  ],
  providers: [ZipCodeCSVService, ZipCodeCSVProcessor],
  exports: [ZipCodeCSVService, ZipCodeCSVProcessor],
})
export class ZipCodeCSVModule {}
