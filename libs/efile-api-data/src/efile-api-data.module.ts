import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../config/database.config';
import { EfileApiDataService } from './efile-api-data.service';
import { ElectionsModule } from './elections/elections.module';

@Module({
  imports: [
    ElectionsModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
  ],
  providers: [EfileApiDataService],
  exports: [],
})
export class EfileApiDataModule {}
