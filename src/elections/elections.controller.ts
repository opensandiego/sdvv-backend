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
import { ElectionsService } from './elections.service';
import { CreateElectionDto } from './dto/createElection.dto';
import { UpdateElectionDto } from './dto/updateElection.dto';

@Controller('elections')
export class ElectionsController {
  constructor(private electionsService: ElectionsService) {}

  @Get()
  async finalAll() {
    return await this.electionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.electionsService.findOne(id);
  }

  @Post()
  async create(@Body() election: CreateElectionDto) {
    return await this.electionsService.create(election);
  }

  @Post('bulk')
  async createBulk(
    @Body(new ParseArrayPipe({ items: CreateElectionDto }))
    createElectionDto: CreateElectionDto[],
  ) {
    return await this.electionsService.createBulk(createElectionDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() election: UpdateElectionDto) {
    return await this.electionsService.update(id, election);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.electionsService.remove(id);
  }
}
