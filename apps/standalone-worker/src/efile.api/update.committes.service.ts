import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ClassValidationService } from '../utils/utils.class.validation.service';
import { SharedService } from '@app/sdvv-database/shared/shared.service';
import { CreateCommitteeDto } from '@app/efile-api-data/tables/dto/createCommittee.dto';
import { CommitteeEntity } from '@app/efile-api-data/tables/entity/committees.entity';

@Injectable()
export class UpdateCommitteesService {
  constructor(
    private httpService: HttpService,
    private classValidationService: ClassValidationService,
    private sharedService: SharedService,
  ) {}

  private eFileCommitteeUrl =
    'https://efile.sandiego.gov/api/v1/public/campaign-search/by-name';

  async updateCommittees() {
    try {
      await this.downloadUpdateCommittees();
      console.log('Update Committees Complete');
    } catch {
      console.error('Error updating Committees');
    }
  }

  private async downloadUpdateCommittees() {
    const url = `${this.eFileCommitteeUrl}?candidate_name=`;

    const response = await firstValueFrom(this.httpService.get(url));

    const committees = response.data.data['committee_list'];

    const classes = await this.classValidationService.getValidatedClasses(
      committees,
      CreateCommitteeDto,
    );

    await this.sharedService.createBulkData(classes, CommitteeEntity);
  }
}
