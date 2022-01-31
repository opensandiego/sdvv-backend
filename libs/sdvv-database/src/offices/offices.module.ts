import { Module } from '@nestjs/common';
import { CandidateModule } from '../candidate/candidate.module';
import { ContributionsModule } from '../contributions/contributions.module';
import { OfficeResolver } from './office/office.resolver';
import { OfficesResolver } from './offices.resolver';
import { OfficesService } from './offices.service';

@Module({
  imports: [CandidateModule, ContributionsModule],
  providers: [OfficesResolver, OfficesService, OfficeResolver],
  exports: [],
})
export class OfficesModule {}
