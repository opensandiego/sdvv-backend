import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { SharedService } from '@app/sdvv-database/shared/shared.service';
import { ClassValidationService } from '../utils/utils.class.validation.service';
import { CreateCandidateDto } from '@app/efile-api-data/tables/dto/createCandidate.dto';
import { CandidateEntity } from '@app/efile-api-data/tables/entity/candidates.entity';

@Injectable()
export class CandidatesUpdateService {
  constructor(
    private httpService: HttpService,
    private classValidationService: ClassValidationService,
    private sharedService: SharedService,
  ) {}

  private eFileCandidateUrl =
    'https://efile.sandiego.gov/api/v1/public/campaign-search/candidate/list';

  async updateCandidate(electionID: string) {
    try {
      await this.downloadUpdateCandidates(electionID);
      console.log('Update Elections Complete');
    } catch {
      console.error('Error updating Elections');
    }
  }

  private async downloadUpdateCandidates(electionID: string) {
    const url = `${this.eFileCandidateUrl}/${electionID}`;
    const response = await firstValueFrom(this.httpService.get(url));

    const offices = response.data.data;

    const candidates = [];
    for (const office in offices) {
      offices[office].forEach((candidate) => {
        candidates.push(candidate);
      });
    }

    const classes = await this.classValidationService.getValidatedClasses(
      candidates,
      CreateCandidateDto,
    );

    await this.sharedService.createBulkData(classes, CandidateEntity);
  }
}
