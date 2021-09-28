import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UtilsModule } from '../utils/utils.module';
import { SharedModule } from '@app/sdvv-database/shared/shared.module';
import { ElectionsUpdateService } from './elections.update.service';
import { UpdateCommitteesService } from './update.committes.service';
import { CandidatesUpdateService } from './candidates.update.service';
import { TablesModule } from '@app/efile-api-data/tables/tables.module';
import { UpdateFilingsService } from './update.filings.service';

@Module({
  imports: [HttpModule, UtilsModule, SharedModule, TablesModule],
  providers: [
    ElectionsUpdateService,
    UpdateCommitteesService,
    CandidatesUpdateService,
    UpdateFilingsService,
  ],
  exports: [
    ElectionsUpdateService,
    UpdateCommitteesService,
    CandidatesUpdateService,
    UpdateFilingsService,
  ],
})
export class EFileApiModule {}
