import { Injectable } from '@nestjs/common';
import { SharedService } from '../shared/shared.service';
import { CreateJurisdictionDto } from './dto/createJurisdiction.dto';
import { JurisdictionEntity } from './jurisdictions.entity';

@Injectable()
export class JurisdictionsService {
  constructor(private sharedService: SharedService) {}

  async createBulkJurisdictions(
    createJurisdictionDto: CreateJurisdictionDto[],
  ): Promise<void> {
    await this.sharedService.createBulkData(
      createJurisdictionDto,
      JurisdictionEntity,
    );
  }
}
