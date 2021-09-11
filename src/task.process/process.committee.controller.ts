import { Body, Controller, Param, Post } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Controller('committee')
export class TaskCommitteeController {
  constructor(
    @InjectQueue('process-committee') private readonly tasksQueue: Queue,
  ) {}

  @Post()
  async computeCommitteesForAll() {
    console.log('computeCommitteesForAll');
    return await this.tasksQueue.add('candidate-committees-all');
  }

  @Post('election/:election_id')
  async computeCommitteesByElection(@Param('election_id') electionID: string) {
    return await this.tasksQueue.add('candidate-committees-election', {
      id: electionID,
    });
  }

  @Post('candidate/:coe_id')
  async computeCommitteesForCandidate(@Param('coe_id') coeID: string) {
    return await this.tasksQueue.add('candidate-committee', {
      id: coeID,
    });
  }
}
