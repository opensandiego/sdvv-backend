import { Module } from '@nestjs/common';
import { CommitteeResolver } from './committee.resolver';
import { CommitteeService } from './committee.service';

@Module({
  imports: [],
  providers: [CommitteeResolver, CommitteeService],
  exports: [CommitteeService],
})
export class CommitteeModule {}
