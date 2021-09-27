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

  @Get('processed')
  async fineAllProcessed() {
    return await this.transactionsService.findProcessed();
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

  // @Post()
  // @UsePipes(new ValidationPipe({ transform: true }))
  // async create(@Body() createTransactionDto: CreateTransactionDto) {
  //   return await this.transactionsService.create(createTransactionDto);
  // }

  // @Post('bulk')
  // async createBulk(
  //   @Body(new ParseArrayPipe({ items: CreateTransactionDto }))
  //   createTransactionDto: CreateTransactionDto[],
  // ) {
  //   return await this.transactionsService.createBulk(createTransactionDto);
  // }

  // @Post('bulk/update')
  // async updateBulkSupOpp(
  //   @Body(new ParseArrayPipe({ items: UpdateTransactionDto }))
  //   updateTransactionDto: UpdateTransactionDto[],
  // ) {
  //   return await this.transactionsService.updateBulkSupOpp(
  //     updateTransactionDto,
  //   );
  // }

  // @Put(':filing_id/:tran_id/:schedule')
  // @UsePipes(new ValidationPipe({ transform: true }))
  // async update(
  //   @Param('filing_id') filingID: string,
  //   @Param('tran_id') tranID: string,
  //   @Param('schedule') schedule: string,
  //   @Body() updateTransactionDto: UpdateTransactionDto,
  // ) {
  //   return await this.transactionsService.update(
  //     filingID,
  //     tranID,
  //     schedule,
  //     updateTransactionDto,
  //   );
  // }

  // @Delete(':filing_id/:tran_id/:schedule')
  // async remove(
  //   @Param('filing_id') filingID: string,
  //   @Param('tran_id') tranID: string,
  //   @Param('schedule') schedule: string,
  // ) {
  //   return await this.transactionsService.remove(filingID, tranID, schedule);
  // }
}
