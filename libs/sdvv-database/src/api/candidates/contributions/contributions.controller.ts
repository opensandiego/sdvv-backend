import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CandidateContributionsService } from './contributions.service';
import { CandidateContributionsByLocation } from './interfaces/candidate-contributions.interface';
import { CandidateContributionQueryDto } from './dto/candidate-contributions.dto';

type CandidateContributionsResponse = {
  data: CandidateContributionsByLocation[];
};

@Controller('api')
export class CandidateContributionsController {
  constructor(
    private readonly contributionsService: CandidateContributionsService,
  ) {}

  @Get('candidates/summaries/contributions/in-out-city')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getContributionsByLocation(
    @Query() query: CandidateContributionQueryDto,
  ): Promise<CandidateContributionsResponse> {
    return {
      data: await this.contributionsService.getContributionsByInOutCity({
        year: query.year,
        office: query.office,
        district: query.district,
      }),
    };
  }
}
