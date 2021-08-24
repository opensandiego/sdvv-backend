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

  @Get(':filing_id')
  async fineTransactionsFromFilling(@Param('filing_id') filingID: string) {
    return await this.transactionsService.findTransactionsFromFilling(filingID);
  }

  @Get(':filing_id/:tran_id')
  async fineOne(
    @Param('filing_id') filingID: string,
    @Param('tran_id') tranID: string,
  ) {
    return await this.transactionsService.findOne(filingID, tranID);
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    return await this.transactionsService.create(createTransactionDto);
  }

  @Post('bulk')
  async createBulk(
    @Body(new ParseArrayPipe({ items: CreateTransactionDto }))
    createTransactionDto: CreateTransactionDto[],
  ) {
    return await this.transactionsService.createBulk(createTransactionDto);
  }

  @Put(':filing_id/:tran_id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Param('filing_id') filingID: string,
    @Param('tran_id') tranID: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return await this.transactionsService.update(
      filingID,
      tranID,
      updateTransactionDto,
    );
  }

  @Delete(':filing_id/:tran_id')
  async remove(
    @Param('filing_id') filingID: string,
    @Param('tran_id') tranID: string,
  ) {
    return await this.transactionsService.remove(filingID, tranID);
  }
}
