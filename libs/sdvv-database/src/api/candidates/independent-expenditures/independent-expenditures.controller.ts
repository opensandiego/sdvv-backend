import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CandidateIndependentExpendituresService } from './independent-expenditures.service';
import { CandidatesIndependentExpendituresDto } from './dto/independent-expenditures.dto';
import { CandidateIndependentExpenditures } from './interfaces/independent-expenditures.interface';

type CandidateIndependentExpendituresResponse = {
  data: CandidateIndependentExpenditures[];
};

@Controller('api')
export class CandidateIndependentExpendituresController {
  constructor(
    private readonly independentExpendituresService: CandidateIndependentExpendituresService,
  ) {}

  @Get('candidates/summaries/independent-expenditures')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getOfficeIndependentExpenditures(
    @Query() query: CandidatesIndependentExpendituresDto,
  ): Promise<CandidateIndependentExpendituresResponse> {
    return {
      data: await this.independentExpendituresService.getIndependentExpendituresCandidates(
        {
          district: query.district,
          office: query.office,
          year: query.year,
        },
      ),
    };
  }
}
