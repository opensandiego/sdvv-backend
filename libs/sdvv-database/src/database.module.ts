import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { ZipCodesModule } from './zipCodes/zipCodes.module';
import { JurisdictionsModule } from './jurisdictions/jurisdictions.module';

@Module({
  imports: [ZipCodesModule, JurisdictionsModule],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
