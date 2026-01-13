import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UtilsModule } from '../utils/utils.module';
import { SharedModule } from '@app/sdvv-database/shared/shared.module';
import { ElectionsUpdateService } from './elections.update.service';
import { UpdateCommitteesService } from './update.committes.service';
import { CandidatesUpdateService } from './candidates.update.service';
import { CandidatesInfoUpdateService } from './candidates-info.update.service';
import { TablesModule } from '@app/efile-api-data/tables/tables.module';
import { ProcessDataModule } from '@app/sdvv-database/process.data/process.data.module';
import { CandidateModule } from '@app/sdvv-database/candidate/candidate.module';

@Module({
  imports: [
    HttpModule,
    UtilsModule,
    SharedModule,
    TablesModule,
    ProcessDataModule,
    CandidateModule,
  ],
  providers: [
    ElectionsUpdateService,
    UpdateCommitteesService,
    CandidatesUpdateService,
    CandidatesInfoUpdateService,
  ],
  exports: [
    ElectionsUpdateService,
    UpdateCommitteesService,
    CandidatesUpdateService,
    CandidatesInfoUpdateService,
  ],
})
export class EFileApiModule {}
