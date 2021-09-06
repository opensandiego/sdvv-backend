import { Body, Controller, Param, Post } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { DateRangeDto } from './dto/dateRange.dto';

@Controller('tasks')
export class TasksController {
  constructor(
    @InjectQueue('update-tasks') private readonly tasksQueue: Queue,
  ) {}

  @Post('check-tasks')
  async checkTasks() {
    return (
      await this.tasksQueue.add({
        check: 'task checked',
      })
    ).data;
  }

  @Post('update-elections')
  async updateElections() {
    await this.tasksQueue.add({
      update: 'elections',
    });
  }

  @Post('update-committees')
  async updateCommittees() {
    await this.tasksQueue.add({
      update: 'committees',
    });
  }

  @Post('update-candidates/:election_id')
  async updateCandidates(@Param('election_id') electionID: string) {
    await this.tasksQueue.add({
      update: 'candidates',
      id: electionID,
    });
  }

  @Post('update-filings')
  async updateFilings(@Body() dateRangeDto: DateRangeDto) {
    await this.tasksQueue.add({
      update: 'filings',
      ranges: dateRangeDto,
    });
  }

  @Post('update-transactions')
  async updateTransactions(@Body() dateRangeDto: DateRangeDto) {
    await this.tasksQueue.add({
      update: 'transactions',
      ranges: dateRangeDto,
    });
  }
}
