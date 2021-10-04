import { Module } from '@nestjs/common';
import { UtilsModule } from '../utils/utils.module';
import { ZipCodeCSVService } from './zip.code.csv.service';
import { ZipCodesModule } from '@app/sdvv-database/zipCodes/zipCodes.module';
import { JurisdictionZipCodeService } from './jurisdiction.zip.codes.service';
import { JurisdictionsModule } from '@app/sdvv-database/jurisdictions/jurisdictions.module';

@Module({
  imports: [UtilsModule, ZipCodesModule, JurisdictionsModule],
  providers: [ZipCodeCSVService, JurisdictionZipCodeService],
  exports: [ZipCodeCSVService, JurisdictionZipCodeService],
})
export class ZipCodeCSVModule {}
