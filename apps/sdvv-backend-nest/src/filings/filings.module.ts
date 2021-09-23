import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilingsController } from './filings.controller';
import { FilingEntity } from './filings.entity';
import { FilingsService } from './filings.service';

@Module({
  imports: [TypeOrmModule.forFeature([FilingEntity])],
  providers: [FilingsService],
  controllers: [FilingsController],
})
export class FilingsModule {}
