import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Connection } from 'typeorm';
import { CandidateCommitteeService } from './candidate.committee.service';
import { CandidateEntity } from 'src/candidates/candidates.entity';
import { ElectionEntity } from 'src/elections/elections.entity';

@Processor('compute-tasks')
export class ComputeProcessorService {
  constructor(
    private connection: Connection,
    private candidateCommitteeService: CandidateCommitteeService,
  ) {}

  @Process('candidate-committee')
  async setCandidateCommittee(job: Job<unknown>) {
    console.log('candidate-committees: started');

    try {
      const candidateRepository =
        this.connection.getRepository(CandidateEntity);
      const electionRepository = this.connection.getRepository(ElectionEntity);

      const candidate: CandidateEntity = await candidateRepository.findOne(
        job.data.id,
      );

      const election = await electionRepository.findOne(candidate.election_id);

      const committeeName =
        await this.candidateCommitteeService.getCandidateCommittee(
          candidate,
          election.election_date,
        );

      candidate.candidate_controlled_committee_name = committeeName;
      await candidateRepository.save(candidate);
    } catch (error) {
      console.log('Error in candidate-committees');
    }

    console.log('candidate-committees: completed');
    return {};
  }
}
