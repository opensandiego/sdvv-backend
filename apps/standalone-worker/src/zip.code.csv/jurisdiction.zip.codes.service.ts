import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { CreateJurisdictionDto } from '@app/sdvv-database/jurisdictions/dto/createJurisdiction.dto';
import { JurisdictionsService } from '@app/sdvv-database/jurisdictions/jurisdictions.service';
import { ClassValidationService } from '../utils/utils.class.validation.service';

@Injectable()
export class JurisdictionZipCodeService {
  constructor(
    private classValidationService: ClassValidationService,
    private jurisdictionsService: JurisdictionsService,
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
    } catch {
      console.log('Error in populateDatabaseWithJurisdictionZipCodes');
    }
  }

  private getJson() {
    const jsonFileName = 'jurisdiction_zip_codes.json';
    const filePath = `${__dirname}/assets/${jsonFileName}`;

    if (!fs.existsSync(filePath)) {
      console.log('File not found: ', filePath);
      throw `File not found: ${filePath}`;
    }

    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
}
