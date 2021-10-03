import { Module } from '@nestjs/common';
import { SharedQueryService } from './shared.query.service';
import { ElectionOfficeService } from './election.office.service';
import { RaisedCommitteeService } from './raised.committee.service';

@Module({
  imports: [],
  providers: [
    SharedQueryService,
    ElectionOfficeService,
    RaisedCommitteeService,
  ],
  exports: [ElectionOfficeService, RaisedCommitteeService],
})
export class QueriesModule {}
