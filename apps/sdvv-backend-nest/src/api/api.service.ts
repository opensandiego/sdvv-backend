import { Injectable, NotFoundException } from '@nestjs/common';
import { ElectionOfficeService } from '@app/efile-api-data/queries/election.office.service';
import { RaisedCommitteeService } from '@app/efile-api-data/queries/raised.committee.service';
import { OfficeSummary } from './interfaces/office.summary';
import { CandidateNavigation } from './interfaces/candidate.navigation';
import { CandidateNavigationService } from '@app/efile-api-data/queries/candidate.navigation.service';

@Injectable()
export class APIService {
  constructor(
    private electionOfficeService: ElectionOfficeService,
    private raisedCommitteeService: RaisedCommitteeService,
    private candidateNavigationService: CandidateNavigationService,
  ) {}

  async getOfficesSummaryByYear(year: string): Promise<OfficeSummary[]> {
    try {
      const offices = await this.electionOfficeService.getOfficesByYear(year);

      for await (const office of offices) {
        const total = await this.raisedCommitteeService.getRaisedByCommittees(
          office['committee_names'],
        );
        office.totalRaised = total;
        delete office['committee_names'];
      }

      return offices;
    } catch (error) {
      console.log('Error in getOfficesSummaryByYear');
      throw new NotFoundException();
    }
  }

  async getCandidateNavigationByYear(
    year: string,
  ): Promise<CandidateNavigation[]> {
    try {
      const candidates =
        await this.candidateNavigationService.getCandidateNavigationByYear(
          year,
        );

      return candidates;
    } catch (error) {
      console.log('Error in getCandidateNavigation');
      throw new NotFoundException();
    }
  }
}
