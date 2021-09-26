import { Module } from '@nestjs/common';
import { UtilsModule } from '../utils/utils.module';
import { ZipCodeCSVService } from './zip.code.csv.service';
import { ZipCodesModule } from '@app/sdvv-database/zipCodes/zipCodes.module';

@Module({
  imports: [UtilsModule, ZipCodesModule],
  providers: [ZipCodeCSVService],
  exports: [ZipCodeCSVService],
})
export class ZipCodeCSVModule {}
