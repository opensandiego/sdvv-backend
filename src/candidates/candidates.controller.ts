import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { CreateCandidateDto } from './dto/createCandidate.dto';
import { UpdateCandidateDto } from './dto/updateCandidate.dto';

@Controller('candidates')
export class CandidatesController {
  constructor(private candidatesService: CandidatesService) {}

  @Get()
  async finalAll() {
    return await this.candidatesService.findAll();
  }

  @Get(':id')
  async fineOne(@Param('id', ParseIntPipe) id: number) {
    return await this.candidatesService.findOne(id);
  }

  @Post()
  async create(@Body() election: CreateCandidateDto) {
    return await this.candidatesService.create(election);
  }

  @Post('bulk')
  async createBulk(
    @Body(new ParseArrayPipe({ items: CreateCandidateDto }))
    createElectionDto: CreateCandidateDto[],
  ) {
    return await this.candidatesService.createBulk(createElectionDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() election: UpdateCandidateDto,
  ) {
    return await this.candidatesService.update(id, election);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.candidatesService.remove(id);
  }
}
