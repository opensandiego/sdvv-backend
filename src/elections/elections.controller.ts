import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ElectionDto } from './interfaces/election.dto';
@Controller('elections')
export class ElectionsController {
  @Get()
  finalAll(): string {
    return 'All Elections';
  }

  @Get()
  getElections() {
    return 'All of the Elections';
  }

  @Post()
  create(@Body() electionDto: ElectionDto) {
    return electionDto;
  }

  @Get(':id')
  fineOne(@Param('id') id: string) {
    return `election with id ${id}`;
  }
  
  @Put(':id')
  update(@Param('id') id: string) {
    return `update election with id ${id}`;
  }
  
  @Delete(':id')
  remove(@Param('id') id: string) {
    return `delete election with id ${id}`;
  }
  
}
