import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { SharedService } from '@app/sdvv-database/shared/shared.service';
import { ClassValidationService } from '../utils/utils.class.validation.service';
import { CreateCandidateDto } from '@app/efile-api-data/tables/dto/createCandidate.dto';
import { CandidateEntity } from '@app/efile-api-data/tables/entity/candidates.entity';
import { CandidateYearService } from '@app/sdvv-database/process.data/candidates.year.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ElectionYears } from '../assets/elections';

@Injectable()
export class CandidatesUpdateService {
  constructor(
    private httpService: HttpService,
    private classValidationService: ClassValidationService,
    private sharedService: SharedService,
    private candidateYearService: CandidateYearService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  private eFileCandidateUrl =
    'https://efile.sandiego.gov/api/v1/public/campaign-search/candidate/list';

  public async updateCandidatesCurrent() {
    const currentElection = ElectionYears.find((election) => election.current);

    await this.updateCandidatesYear(currentElection.year.toString());
  }

  public async updateCandidatesPast() {
    const pastElections = ElectionYears.filter((election) => !election.current);

    for await (const election of pastElections) {
      await this.updateCandidatesYear(election.year.toString());
    }
  }

  async updateCandidatesYear(year: string) {
    try {
      const elections = await this.candidateYearService.getElectionsByYear(
        year,
      );

      if (elections.length < 1) {
        this.logger.log({
          level: 'warn',
          message:
            'No Elections found in database for year. Skipping update of candidates for year.',
          year: year,
        });
        throw `No Elections found: ${year}`;
      }

      const primaryClasses = await this.getCandidatesClasses(
        elections,
        'Primary',
        year,
      );

      if (primaryClasses.length > 0) {
        await this.sharedService.createBulkData(
          primaryClasses,
          CandidateEntity,
        );
      }

      const generalClasses = await this.getCandidatesClasses(
        elections,
        'General',
        year,
      );

      if (generalClasses.length > 0) {
        const filerIDs = generalClasses.map((election) => election.filer_id);
        await this.candidateYearService.addInGeneralByYear(filerIDs, year);
      }

      this.logger.info('Update Candidates for Year Complete', { year: year });
    } catch {
      this.logger.error('Updating Candidates for Year failed', { year: year });
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
      this.logger.log({
        level: 'warn',
        message: 'No Candidates found in database for election.',
        year: year,
        electionType: electionType,
      });
      return [];
    }

    const candidates = await this.getCandidates(
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

  private async getCandidates(electionID: string) {
    const offices = await this.downloadOffices(electionID);

    const candidates = [];
    for (const office in offices) {
      offices[office].forEach((candidate) => {
        candidates.push(candidate);
      });
    }

    return candidates;
  }

  private async downloadOffices(electionID: string) {
    const url = `${this.eFileCandidateUrl}/${electionID}`;

    try {
      const response = await firstValueFrom(this.httpService.get(url));

      return response.data.data;
    } catch (error) {
      this.logger.log({
        level: 'error',
        message: 'Get request to eFile API failed',
        type: 'eFile API',
        data: 'candidates',
        url: url,
      });
      throw error;
    }
  }
}
