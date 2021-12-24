import { Controller, Get } from '@nestjs/common';
import { APILastUpdatedService } from './api-last-updated.service';

@Controller('api')
export class APINonCachedController {
  constructor(private apiLastUpdatedService: APILastUpdatedService) {}

  @Get('last-update')
  async getLastUpdate() {
    return this.apiLastUpdatedService.getLastUpdated();
  }
}
