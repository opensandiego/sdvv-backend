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

@Controller('zip-codes')
export class ZipCodesController {
  @Get()
  async finalAll() {
    // return await this.zipCodesService.findAll();
  }
}
