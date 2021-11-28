import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ClassValidationService } from '../utils/utils.class.validation.service';
import { SharedService } from '@app/sdvv-database/shared/shared.service';
import { CreateCommitteeDto } from '@app/efile-api-data/tables/dto/createCommittee.dto';
import { CommitteeEntity } from '@app/efile-api-data/tables/entity/committees.entity';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class UpdateCommitteesService {
  constructor(
    private httpService: HttpService,
    private classValidationService: ClassValidationService,
    private sharedService: SharedService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  private eFileCommitteeUrl =
    'https://efile.sandiego.gov/api/v1/public/campaign-search/by-name';

  async updateCommittees() {
    try {
      const committees = await this.downloadCommittees();

      await this.addCommittees(committees);
      this.logger.info('Update Committees Complete');
    } catch {
      this.logger.error('Error updating Committees');
    }
  }

  private async downloadCommittees() {
    const url = `${this.eFileCommitteeUrl}?candidate_name=`;

    try {
      const response = await firstValueFrom(this.httpService.get(url));

      return response.data.data['committee_list'];
    } catch (error) {
      this.logger.log({
        level: 'error',
        message: 'Get request to eFile API failed',
        type: 'efile API',
        data: 'committees',
        url: url,
      });
      throw error;
    }
  }

  private async addCommittees(committees) {
    const classes = await this.classValidationService.getValidatedClasses(
      committees,
      CreateCommitteeDto,
    );

    await this.sharedService.createBulkData(classes, CommitteeEntity);
  }
}
