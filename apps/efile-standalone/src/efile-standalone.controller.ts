import { Controller, Get } from '@nestjs/common';
import { EfileStandaloneService } from './efile-standalone.service';

@Controller()
export class EfileStandaloneController {
  constructor(private readonly efileStandaloneService: EfileStandaloneService) {}

  @Get()
  getHello(): string {
    return this.efileStandaloneService.getHello();
  }
}
