import { Injectable, NotFoundException } from '@nestjs/common';
import { ElectionOfficeService } from '@app/efile-api-data/queries/election.office.service';
import { RaisedCommitteeService } from '@app/efile-api-data/queries/raised.committee.service';
import { OfficeSummary } from './interfaces/office.summary';

@Injectable()
export class APIService {
  constructor(
    private electionOfficeService: ElectionOfficeService,
    private raisedCommitteeService: RaisedCommitteeService,
  ) {}

  async getOfficesSummary(electionId: string): Promise<OfficeSummary[]> {
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
      throw new NotFoundException();
    }
  }
}
