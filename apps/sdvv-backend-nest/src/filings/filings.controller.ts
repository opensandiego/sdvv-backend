import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FilingsService } from './filings.service';
import { CreateFilingDto } from './dto/createFiling.dto';
import { UpdateFilingDto } from './dto/updateFiling.dto';

@Controller('filings')
export class FilingsController {
  constructor(private filingsService: FilingsService) {}

  @Get()
  async finalAll() {
    return await this.filingsService.findAll();
  }

  @Get(':id')
  async fineOne(@Param('id') id: string) {
    return await this.filingsService.findOne(id);
  }

  // @Post()
  // @UsePipes(new ValidationPipe({ transform: true }))
  // async create(@Body() filing: CreateFilingDto) {
  //   return await this.filingsService.create(filing);
  // }

  // @Post('bulk')
  // async createBulk(
  //   @Body(new ParseArrayPipe({ items: CreateFilingDto }))
  //   createFilingDto: CreateFilingDto[],
  // ) {
  //   return await this.filingsService.createBulk(createFilingDto);
  // }

  // @Put(':id')
  // async update(
  //   @Param('id') id: string,
  //   @Body() updateFilingDto: UpdateFilingDto,
  // ) {
  //   return await this.filingsService.update(id, updateFilingDto);
  // }

  // @Delete(':id')
  // async remove(@Param('id') id: string) {
  //   return await this.filingsService.remove(id);
  // }
}
