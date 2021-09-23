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
import { CommitteesService } from './committees.service';
import { CreateCommitteeDto } from './dto/createCommittee.dto';
// import { UpdateCommitteeDto } from './dto/updateCommittee.dto';

@Controller('committees')
export class CommitteesController {
  constructor(private committeesService: CommitteesService) {}

  @Get()
  async finalAll() {
    return await this.committeesService.findAll();
  }

  @Get(':entity_id')
  async findOne(@Param('entity_id') entityID: string) {
    return await this.committeesService.findOne(entityID);
  }

  @Post()
  async create(@Body() createCommitteeDto: CreateCommitteeDto) {
    return await this.committeesService.create(createCommitteeDto);
  }

  @Post('bulk')
  async createBulk(
    @Body(new ParseArrayPipe({ items: CreateCommitteeDto }))
    createCommitteeDto: CreateCommitteeDto[],
  ) {
    return await this.committeesService.createBulk(createCommitteeDto);
  }

  // @Put(':entity_id')
  // async update(
  //   @Param('entity_id') id: string,
  //   @Body() updateCommitteeDto: UpdateCommitteeDto,
  // ) {
  //   return await this.committeesService.update(id, updateCommitteeDto);
  // }

  // @Delete(':entity_id')
  // async remove(@Param('entity_id') entityID: string) {
  //   return await this.committeesService.remove(entityID);
  // }
}
