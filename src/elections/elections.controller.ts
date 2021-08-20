import { Controller, Get } from '@nestjs/common';
@Controller('elections')
export class ElectionsController {
  @Get()
  finalAll(): string {
    return 'All Elections';
  }
}
