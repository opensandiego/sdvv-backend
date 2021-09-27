import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../config/database.config';
import { EfileApiDataService } from './efile-api-data.service';
import { ElectionsModule } from './elections/elections.module';
import { CandidatesModule } from './candidates/candidates.module';

@Module({
  imports: [
    ElectionsModule,
    CandidatesModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
  ],
  providers: [EfileApiDataService],
  exports: [],
})
export class EfileApiDataModule {}
