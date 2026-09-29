import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CityCouncilDistrictsSpendingService } from './city-council-districts-spending.service';
import { CityCouncilDistrictsSpendingQueryDto } from './dto/city-council-districts-spending.dto';
import { CityCouncilDistrictSpending } from './interfaces/city-council-districts-spending.interface';

type CityCouncilDistrictsSpendingResponse = {
  data: CityCouncilDistrictSpending[];
};

@Controller('api')
export class CityCouncilDistrictsSpendingController {
  constructor(
    private readonly cityCouncilDistrictsSpendingService: CityCouncilDistrictsSpendingService,
  ) {}

  @Get('office/summaries/spending/city-council/districts')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getSpendingByCityCouncilDistricts(
    @Query() query: CityCouncilDistrictsSpendingQueryDto,
  ): Promise<CityCouncilDistrictsSpendingResponse> {
    const result =
      await this.cityCouncilDistrictsSpendingService.getCityCouncilDistrictsSpending(
        {
          electionYear: query.electionYear,
        },
      );

    return {
      data: result,
    };
  }
}
