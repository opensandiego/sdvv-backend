import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '../shared/shared.module';
import { JurisdictionEntity } from './jurisdictions.entity';
import { JurisdictionsService } from './jurisdictions.service';

@Module({
  imports: [TypeOrmModule.forFeature([JurisdictionEntity]), SharedModule],
  providers: [JurisdictionsService],
  exports: [JurisdictionsService],
})
export class JurisdictionsModule {}
