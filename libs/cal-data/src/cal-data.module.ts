import { Module } from '@nestjs/common';
import { CalDataService } from './cal-data.service';

@Module({
  providers: [CalDataService],
  exports: [CalDataService],
})
export class CalDataModule {}
