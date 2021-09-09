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

  @Process('candidate-committees-election')
  async processCandidateCommitteeForElection(job: Job<unknown>) {
    console.log('candidate-committees-election: started');

    try {
      const electionID = job.data.id;

      const candidateRepository =
        this.connection.getRepository(CandidateEntity);

      let candidates: CandidateEntity[] = await candidateRepository.find({
        where: {
          election_id: electionID,
        },
      });

      candidates = await this.setCandidateCommittee(candidates, electionID);
      await candidateRepository.save(candidates);
    } catch (error) {
      console.log('Error in candidate-committees-election');
    }

    console.log('candidate-committees-election: completed');
    return {};
  }

  async setCandidateCommittee(
    candidates: CandidateEntity[],
    electionID: string,
  ): Promise<CandidateEntity[]> {
    const electionRepository = this.connection.getRepository(ElectionEntity);

    const election = await electionRepository.findOne(electionID);

    for await (const candidate of candidates) {
      const committeeName =
        await this.candidateCommitteeService.getCandidateCommittee(
          candidate,
          election.election_date,
        );

      candidate.candidate_controlled_committee_name = committeeName;
    }

    return candidates;
  }

  @Process('candidate-committee')
  async processCandidateCommittee(job: Job<unknown>) {
    console.log('candidate-committees: started');

    try {
      const candidateID = job.data.id;

      const candidateRepository =
        this.connection.getRepository(CandidateEntity);

      let candidates: CandidateEntity[] = await candidateRepository.find({
        where: {
          coe_id: candidateID,
        },
      });

      candidates = await this.setCandidateCommittee(
        candidates,
        candidates[0].election_id,
      );
      await candidateRepository.save(candidates);
    } catch (error) {
      console.log('Error in candidate-committees');
    }

    console.log('candidate-committees: completed');
    return {};
  }
}
