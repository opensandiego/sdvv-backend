import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CandidatesService } from './candidates.service';
// import { CreateCandidateDto } from './dto/createCandidate.dto';
// import { UpdateCandidateDto } from './dto/updateCandidate.dto';

@Controller('candidates')
export class CandidatesController {
  constructor(private candidatesService: CandidatesService) {}

  @Get()
  async finalAll() {
    return await this.candidatesService.findAll();
  }

  @Get(':id')
  async fineOne(@Param('id') id: string) {
    return await this.candidatesService.findOne(id);
  }

  // @Post()
  // async create(@Body() candidate: CreateCandidateDto) {
  //   return await this.candidatesService.create(candidate);
  // }

  // @Post('bulk')
  // async createBulk(
  //   @Body(new ParseArrayPipe({ items: CreateCandidateDto }))
  //   createCandidateDto: CreateCandidateDto[],
  // ) {
  //   return await this.candidatesService.createBulk(createCandidateDto);
  // }

  // @Put(':id')
  // async update(@Param('id') id: string, @Body() candidate: UpdateCandidateDto) {
  //   return await this.candidatesService.update(id, candidate);
  // }

  // @Delete(':id')
  // async remove(@Param('id') id: string) {
  //   return await this.candidatesService.remove(id);
  // }
}
