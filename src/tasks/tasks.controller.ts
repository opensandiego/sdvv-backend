import { Body, Controller, Param, Post } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { DateRangeDto } from './dto/dateRange.dto';

@Controller('tasks')
export class TasksController {
  constructor(
    @InjectQueue('update-tasks') private readonly tasksQueue: Queue,
    @InjectQueue('compute-tasks') private readonly tasksComputeQueue: Queue,
  ) {}

  @Post('candidate/committee/compute')
  async computeCommitteesForAll() {
    return await this.tasksComputeQueue.add('candidate-committees-all');
  }

  @Post('compute/committee/election/:election_id')
  async computeCommitteesByElection(@Param('election_id') electionID: string) {
    return await this.tasksComputeQueue.add('candidate-committees-election', {
      id: electionID,
    });
  }

  @Post('compute/committee/candidate/:coe_id')
  async computeCommitteesForCandidate(@Param('coe_id') coeID: string) {
    return await this.tasksComputeQueue.add('candidate-committee', {
      id: coeID,
    });
  }

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
