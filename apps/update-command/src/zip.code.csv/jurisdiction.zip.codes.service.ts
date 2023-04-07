import { Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { CreateJurisdictionDto } from '@app/sdvv-database/jurisdictions/dto/createJurisdiction.dto';
import { JurisdictionsService } from '@app/sdvv-database/jurisdictions/jurisdictions.service';
import { ClassValidationService } from '../utils/utils.class.validation.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class JurisdictionZipCodeService {
  constructor(
    private classValidationService: ClassValidationService,
    private jurisdictionsService: JurisdictionsService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async populateDatabaseWithJurisdictionZipCodes() {
    try {
      const json = this.getJson();

      const jurisdictionClasses =
        await this.classValidationService.getValidatedClasses(
          json,
          CreateJurisdictionDto,
        );

      await this.jurisdictionsService.createBulkJurisdictions(
        jurisdictionClasses,
      );

      this.logger.info(
        'Populating Database with Zip Codes by jurisdiction Complete',
      );
    } catch {
      this.logger.error(
        'Populating Database with Zip Codes by jurisdiction Failed',
      );
    }
  }

  private getJson() {
    const jsonFileName = 'jurisdiction_zip_codes.json';
    const filePath = `${__dirname}/assets/${jsonFileName}`;

    if (!fs.existsSync(filePath)) {
      this.logger.error('File with Zip Codes by jurisdiction not found:.', {
        filePath: filePath,
      });

      throw `File not found: ${filePath}`;
    }

    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
}
