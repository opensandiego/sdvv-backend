import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { SharedService } from '@app/sdvv-database/shared/shared.service';
import { ClassValidationService } from '../utils/utils.class.validation.service';
import { CreateCandidateDto } from '@app/efile-api-data/tables/dto/createCandidate.dto';
import { CandidateEntity } from '@app/efile-api-data/tables/entity/candidates.entity';
import { CandidateYearService } from '@app/sdvv-database/process.data/candidates.year.service';

@Injectable()
export class CandidatesUpdateService {
  constructor(
    private httpService: HttpService,
    private classValidationService: ClassValidationService,
    private sharedService: SharedService,
    private candidateYearService: CandidateYearService,
  ) {}

  private eFileCandidateUrl =
    'https://efile.sandiego.gov/api/v1/public/campaign-search/candidate/list';

  async updateCandidatesYear(year: string) {
    try {
      const elections = await this.candidateYearService.getElectionsByYear(
        year,
      );

      if (elections.length < 1) {
        console.log('No Elections found for:', year);
        return;
      }

      const primaryClasses = await this.getCandidatesClasses(
        elections,
        'Primary',
        year,
      );

      await this.sharedService.createBulkData(primaryClasses, CandidateEntity);

      const generalClasses = await this.getCandidatesClasses(
        elections,
        'General',
        year,
      );

      const filerIDs = generalClasses.map((election) => election.filer_id);

      await this.candidateYearService.addInGeneralByYear(filerIDs, year);

      console.log('Update Candidates By Year Complete');
    } catch {
      console.error('Error updating Candidates By Year');
    }
  }

  private async getCandidatesClasses(
    elections,
    electionType: string,
    year: string,
  ) {
    const candidatesElection = elections.find(
      (election) => election.election_type === electionType,
    );

    if (!candidatesElection) {
      console.log(`No ${electionType} Election found for: ${year}`);
      return;
    }

    const candidates = await this.downloadCandidates(
      candidatesElection['election_id'],
    );

    candidates.forEach((candidate) => {
      candidate.election_year = year;
    });

    return await this.classValidationService.getValidatedClasses(
      candidates,
      CreateCandidateDto,
    );
  }

  private async downloadCandidates(electionID: string) {
    const url = `${this.eFileCandidateUrl}/${electionID}`;
    const response = await firstValueFrom(this.httpService.get(url));

    const offices = response.data.data;

    const candidates = [];
    for (const office in offices) {
      offices[office].forEach((candidate) => {
        candidates.push(candidate);
      });
    }

    return candidates;
  }
}
