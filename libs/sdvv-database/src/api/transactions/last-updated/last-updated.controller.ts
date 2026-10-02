import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LastUpdatedDateQueryDto } from './dto/last-updated.dto';
import { LastUpdatedDateService } from './last-updated.service';

type LastUpdatedDate = {
  date: string;
};

type LastUpdatedDateResponse = {
  data: LastUpdatedDate;
};

@Controller('api')
export class LastUpdatedDateController {
  constructor(
    private readonly lastUpdatedDateService: LastUpdatedDateService,
  ) {}

  @Get('transactions/last-updated')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  )
  async getLastUpdatedDate(
    @Query() query: LastUpdatedDateQueryDto,
  ): Promise<LastUpdatedDateResponse> {
    const result = await this.lastUpdatedDateService.getLastUpdatedDate({
      electionYear: query.electionYear,
    });

    return {
      data: result,
    };
  }
}
