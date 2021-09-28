import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ClassValidationService } from '../utils/utils.class.validation.service';
import { SharedService } from '@app/sdvv-database/shared/shared.service';
import { CreateFilingDto } from '@app/efile-api-data/tables/dto/createFiling.dto';
import { FilingEntity } from '@app/efile-api-data/tables/entity/filings.entity';

@Injectable()
export class UpdateFilingsService {
  constructor(
    private httpService: HttpService,
    private classValidationService: ClassValidationService,
    private sharedService: SharedService,
  ) {}

  private eFileFilingUrl =
    'https://efile.sandiego.gov/api/v1/public/campaign-search';

  async updateFilings(oldestDate: string, newestDate: string) {
    try {
      await this.downloadUpdateFilings(
        new Date(oldestDate).toISOString(),
        new Date(newestDate).toISOString(),
      );
      console.log('Update Filings Complete');
    } catch {
      console.error('Error updating Filings');
    }
  }

  private async downloadUpdateFilings(oldestDate: string, newestDate: string) {
    const url = `${this.eFileFilingUrl}?start_date=${oldestDate}&end_date=${newestDate}`;

    const response = await firstValueFrom(this.httpService.get(url));

    const filings = response.data.data;

    const classes = await this.classValidationService.getValidatedClasses(
      filings,
      CreateFilingDto,
    );

    await this.sharedService.createBulkData(classes, FilingEntity);
  }
}
