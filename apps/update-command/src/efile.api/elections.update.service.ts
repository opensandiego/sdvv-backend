import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ClassValidationService } from '../utils/utils.class.validation.service';
import { CreateElectionDto } from '@app/efile-api-data/tables/dto/createElection.dto';
import { ElectionEntity } from '@app/efile-api-data/tables/entity/elections.entity';
import { SharedService } from '@app/sdvv-database/shared/shared.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class ElectionsUpdateService {
  constructor(
    private httpService: HttpService,
    private classValidationService: ClassValidationService,
    private sharedService: SharedService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  private eFileElectionUrl =
    'https://efile.sandiego.gov/api/v1/public/campaign-search/election/list';

  async updateElections() {
    try {
      const elections = await this.downloadElections();

      await this.addElections(elections);
      this.logger.info('Update Elections Complete');
    } catch {
      this.logger.error('Error updating Elections');
    }
  }

  private async downloadElections() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(this.eFileElectionUrl),
      );
      return response.data.data;
    } catch (error) {
      this.logger.log({
        level: 'error',
        message: 'Get request to eFile API failed',
        type: 'efile API',
        data: 'elections',
        url: this.eFileElectionUrl,
      });
      throw error;
    }
  }

  private async addElections(elections) {
    const classes = await this.classValidationService.getValidatedClasses(
      elections,
      CreateElectionDto,
    );

    await this.sharedService.createBulkData(classes, ElectionEntity);
  }
}
