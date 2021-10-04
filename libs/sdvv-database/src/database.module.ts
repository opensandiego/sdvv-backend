import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { F460DModule } from './f460d/f460d.module';
import { ZipCodesModule } from './zipCodes/zipCodes.module';
import { JurisdictionsModule } from './jurisdictions/jurisdictions.module';

@Module({
  imports: [ZipCodesModule, F460DModule, JurisdictionsModule],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
