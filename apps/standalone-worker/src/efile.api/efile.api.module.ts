import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UtilsModule } from '../utils/utils.module';
import { SharedModule } from '@app/sdvv-database/shared/shared.module';
import { ElectionsUpdateService } from './elections.update.service';
import { CandidatesUpdateService } from './candidates.update.service';
import { TablesModule } from '@app/efile-api-data/tables/tables.module';

@Module({
  imports: [HttpModule, UtilsModule, SharedModule, TablesModule],
  providers: [ElectionsUpdateService, CandidatesUpdateService],
  exports: [ElectionsUpdateService, CandidatesUpdateService],
})
export class EFileApiModule {}
