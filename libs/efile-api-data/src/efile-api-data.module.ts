import { Module } from '@nestjs/common';
import { EfileApiDataService } from './efile-api-data.service';
import { TablesModule } from './tables/tables.module';

@Module({
  imports: [TablesModule],
  providers: [EfileApiDataService],
  exports: [],
})
export class EfileApiDataModule {}
