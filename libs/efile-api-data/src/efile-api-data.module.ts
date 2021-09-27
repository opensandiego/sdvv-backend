import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../config/database.config';
import { EfileApiDataService } from './efile-api-data.service';
import { TablesModule } from './tables/tables.module';

@Module({
  imports: [
    TablesModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
  ],
  providers: [EfileApiDataService],
  exports: [],
})
export class EfileApiDataModule {}
