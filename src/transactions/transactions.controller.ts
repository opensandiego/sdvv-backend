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
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/createTransaction.dto';
import { UpdateTransactionDto } from './dto/updateTransaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Get()
  async finalAll() {
    return await this.transactionsService.findAll();
  }

  @Get(':id')
  async fineOne(@Param('id', ParseIntPipe) id: number) {
    return await this.transactionsService.findOne(id);
  }

  @Post()
  // @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createTransactionDt: CreateTransactionDto) {
    return await this.transactionsService.create(createTransactionDt);
  }

  @Post('bulk')
  async createBulk(
    @Body(new ParseArrayPipe({ items: CreateTransactionDto }))
    createTransactionDto: CreateTransactionDto[],
  ) {
    return await this.transactionsService.createBulk(createTransactionDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return await this.transactionsService.update(id, updateTransactionDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.transactionsService.remove(id);
  }
}
