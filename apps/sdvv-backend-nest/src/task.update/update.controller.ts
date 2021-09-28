import { Body, Controller, Param, Post } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { DateRangeDto } from './dto/dateRange.dto';
@Controller()
export class UpdateController {
  constructor(
    @InjectQueue('update-tasks') private readonly tasksQueue: Queue,
    @InjectQueue('worker') private readonly workerQueue: Queue,
  ) {}

  @Post('elections')
  async updateElections() {
    await this.workerQueue.add('update-elections');
  }

  @Post('transactions/xlsx/:year/:sheet/')
  async transactionsXLSX(
    @Param('year') year: number,
    @Param('sheet') sheet: string,
  ) {
    await this.workerQueue.add('transactions-xlsx', {
      year: year,
      sheet: sheet,
    });
  }

  @Post('committees')
  async updateCommittees() {
    await this.workerQueue.add('update-committees');
  }

  @Post('candidates/:election_id')
  async updateCandidates(@Param('election_id') electionID: string) {
    await this.workerQueue.add('update-candidates', { id: electionID });
  }

  @Post('filings')
  async updateFilings(@Body() dateRangeDto: DateRangeDto) {
    await this.workerQueue.add('update-filings', {
      oldestDate: dateRangeDto.oldestDate,
      newestDate: dateRangeDto.newestDate,
    });
  }

  @Post('transactions')
  async updateTransactions(@Body() dateRangeDto: DateRangeDto) {
    await this.workerQueue.add('update-transactions', {
      oldestDate: dateRangeDto.oldestDate,
      newestDate: dateRangeDto.newestDate,
    });
  }
}
