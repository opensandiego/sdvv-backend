import { Module } from '@nestjs/common';
import { EfileApiDataService } from './efile-api-data.service';

@Module({
  providers: [EfileApiDataService],
  exports: [EfileApiDataService],
})
export class EfileApiDataModule {}
