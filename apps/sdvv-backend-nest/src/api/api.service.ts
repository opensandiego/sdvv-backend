import { Injectable } from '@nestjs/common';
import { SharedQueryService } from '@app/efile-api-data/queries/shared.query.service';
import { ElectionOfficeService } from '@app/efile-api-data/queries/election.office.service';
import { RaisedCommitteeService } from '@app/efile-api-data/queries/raised.committee.service';
import { CandidateSummaryService } from '@app/efile-api-data/queries/candidate.summary.service';

@Injectable()
export class APIService {
  constructor(
    private sharedQueryService: SharedQueryService,
    private electionOfficeService: ElectionOfficeService,
    private raisedCommitteeService: RaisedCommitteeService,
    private candidateSummaryService: CandidateSummaryService,
  ) {}

  async getOfficesSummary(electionId: string) {
    try {
      const offices = await this.electionOfficeService.getOffices(electionId);

      for await (const office of offices) {
        const total = await this.raisedCommitteeService.getRaisedByCommittees(
          office['committee_names'],
        );
        office.totalRaised = total;
        delete office.committee_names;
      }

      return offices;
    } catch (error) {
      console.log('Error in getOfficesSummary');
      return { error: 'Error getting summary of offices.' };
    }
  }
}
