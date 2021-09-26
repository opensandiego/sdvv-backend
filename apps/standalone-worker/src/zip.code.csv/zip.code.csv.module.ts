import { ZipCodesModule } from '@app/cal-data/zipCodes/zipCodes.module';
import { Module } from '@nestjs/common';
import { UtilsModule } from '../utils/utils.module';
import { ZipCodeCSVService } from './zip.code.csv.service';

@Module({
  imports: [UtilsModule, ZipCodesModule],
  providers: [ZipCodeCSVService],
  exports: [ZipCodeCSVService],
})
export class ZipCodeCSVModule {}
