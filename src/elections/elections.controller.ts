import { Controller, Get } from '@nestjs/common';

// interface Election {
//   year: string;
// }

@Controller('elections')
export class ElectionsController {
  @Get()
  finalAll(): string {
    return 'All Elections';
  }
}
