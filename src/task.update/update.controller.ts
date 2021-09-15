import { Body, Controller, Param, Post } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { DateRangeDto } from './dto/dateRange.dto';
@Controller()
export class UpdateController {
  constructor(
    @InjectQueue('update-tasks') private readonly tasksQueue: Queue,
  ) {}

  @Post()
  async general() {
    console.log('update module post received');
    return 'update module post response';
  }

  @Post('elections')
  async updateElections() {
    await this.tasksQueue.add({
      update: 'elections',
    });
  }

  @Post('committees')
  async updateCommittees() {
    await this.tasksQueue.add({
      update: 'committees',
    });
  }

  @Post('candidates/:election_id')
  async updateCandidates(@Param('election_id') electionID: string) {
    await this.tasksQueue.add({
      update: 'candidates',
      id: electionID,
    });
  }

  @Post('filings')
  async updateFilings(@Body() dateRangeDto: DateRangeDto) {
    await this.tasksQueue.add({
      update: 'filings',
      ranges: dateRangeDto,
    });
  }

  @Post('transactions')
  async updateTransactions(@Body() dateRangeDto: DateRangeDto) {
    await this.tasksQueue.add({
      update: 'transactions',
      ranges: dateRangeDto,
    });
  }
}
