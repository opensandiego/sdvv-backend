import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Connection } from 'typeorm';
import { ProcessCandidateCommitteeService } from './process.committee.service';
import { CandidateEntity } from 'src/candidates/candidates.entity';

@Processor('process-committee')
export class ProcessCommitteeService {
  constructor(
    private connection: Connection,
    private candidateCommitteeService: ProcessCandidateCommitteeService,
  ) {}

  @Process('candidate-committees-all')
  async processCandidateCommittees() {
    console.log('candidate-committees-all: started');
    try {
      await this.candidateCommitteeService.updateCandidateCommittees();
    } catch (error) {
      console.log('Error in candidate-committees-all');
    }

    console.log('candidate-committees-all: completed');
    return {};
  }

  @Process('candidate-committees-election')
  async processCandidateCommitteeForElection(job: Job<unknown>) {
    console.log('candidate-committees-election: started');

    try {
      const electionID = job.data.id;

      await this.candidateCommitteeService.updateCandidateCommittees(
        electionID,
      );
    } catch (error) {
      console.log('Error in candidate-committees-election');
    }

    console.log('candidate-committees-election: completed');
    return {};
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

      candidates =
        await this.candidateCommitteeService.setCommitteesForCandidates(
          candidates,
        );

      await candidateRepository.save(candidates);
    } catch (error) {
      console.log('Error in candidate-committees');
    }

    console.log('candidate-committees: completed');
    return {};
  }

  @Process('candidate-committees-delete-all')
  async deleteCandidateCommittees() {
    console.log('candidate-committees-delete-all: started');
    try {
      await this.connection
        .createQueryBuilder()
        .update(CandidateEntity)
        .set({
          candidate_controlled_committee_name: null,
        })
        .execute();
    } catch (error) {
      console.log('Error in candidate-committees-delete-all');
    }

    console.log('candidate-committees-delete-all: completed');
    return {};
  }
}
