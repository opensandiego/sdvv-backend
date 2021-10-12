import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ClassValidationService } from '../utils/utils.class.validation.service';
import { CreateElectionDto } from '@app/efile-api-data/tables/dto/createElection.dto';
import { ElectionEntity } from '@app/efile-api-data/tables/entity/elections.entity';
import { SharedService } from '@app/sdvv-database/shared/shared.service';

@Injectable()
export class ElectionsUpdateService {
  constructor(
    private httpService: HttpService,
    private classValidationService: ClassValidationService,
    private sharedService: SharedService,
  ) {}

  private eFileElectionUrl =
    'https://efile.sandiego.gov/api/v1/public/campaign-search/election/list';

  async updateElections() {
    try {
      await this.downloadUpdateElections();
      console.log('Update Elections Complete');
    } catch {
      console.error('Error updating Elections');
    }
  }

  private async downloadUpdateElections() {
    const response = await firstValueFrom(
      this.httpService.get(this.eFileElectionUrl),
    );

    const elections = response.data.data;

    const classes = await this.classValidationService.getValidatedClasses(
      elections,
      CreateElectionDto,
    );

    await this.sharedService.createBulkData(classes, ElectionEntity);
  }
}
