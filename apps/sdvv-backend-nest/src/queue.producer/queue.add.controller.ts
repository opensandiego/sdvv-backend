import { Body, Controller, Param, Post } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { DateRangeDto } from './dto/dateRange.dto';

@Controller('add')
export class QueueAddController {
  constructor(
    @InjectQueue('worker-add-data') private readonly workerQueueAdd: Queue,
  ) {}

  @Post('elections')
  async updateElections() {
    await this.workerQueueAdd.add('update-elections');
  }

  @Post('candidates/:election_id')
  async updateCandidates(@Param('election_id') electionID: string) {
    await this.workerQueueAdd.add('update-candidates', { id: electionID });
  }

  @Post('committees')
  async updateCommittees() {
    await this.workerQueueAdd.add('update-committees');
  }

  @Post('filings')
  async updateFilings(@Body() dateRangeDto: DateRangeDto) {
    await this.workerQueueAdd.add('update-filings', {
      oldestDate: dateRangeDto.oldestDate,
      newestDate: dateRangeDto.newestDate,
    });
  }

  @Post('transactions')
  async updateTransactions(@Body() dateRangeDto: DateRangeDto) {
    await this.workerQueueAdd.add('update-transactions', {
      oldestDate: dateRangeDto.oldestDate,
      newestDate: dateRangeDto.newestDate,
    });
  }

  @Post('transactions/xlsx/:year/:sheet/')
  async transactionsXLSX(
    @Param('year') year: number,
    @Param('sheet') sheet: string,
  ) {
    await this.workerQueueAdd.add('transactions-xlsx', {
      year: year,
      sheet: sheet,
    });
  }
}
