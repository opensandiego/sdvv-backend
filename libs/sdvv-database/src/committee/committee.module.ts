import { Module } from '@nestjs/common';
import { CommitteeResolver } from './committee.resolver';

@Module({
  imports: [],
  providers: [CommitteeResolver],
  exports: [],
})
export class CommitteeModule {}
