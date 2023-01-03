import { Inject, Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { CandidateEntity } from '@app/sdvv-database/candidate/candidates.entity';
import { CandidateElectionInfo } from '../assets/candidate_info';

@Injectable()
export class CandidatesInfoUpdateService {
  constructor(
    private connection: Connection,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  public async updateCandidatesInfo() {
    const candidates: CandidateEntity[] = await this.getAllCandidates();

    const updatedCandidates: CandidateEntity[] =
      await this.setInfoForCandidates(candidates);

    await this.connection
      .getRepository(CandidateEntity)
      .save(updatedCandidates);
  }

  private async setInfoForCandidates(
    candidates: CandidateEntity[],
  ): Promise<CandidateEntity[]> {
    const candidatesWithIDs = CandidateElectionInfo.filter(
      (candidate) => candidate.candidateId,
    );

    for await (const candidate of candidates) {
      const candidateWithInfo = candidatesWithIDs.find(
        (candidatesWithID) =>
          candidatesWithID.candidateId === candidate.candidate_id,
      );

      candidate.in_primary_election = candidateWithInfo?.inPrimary;
      candidate.description = candidateWithInfo?.description
        ? candidateWithInfo?.description
        : null;
      candidate.image_url = candidateWithInfo?.imageFileName
        ? `images/` + candidateWithInfo?.imageFileName
        : null;
      candidate.website = candidateWithInfo?.website
        ? candidateWithInfo?.website
        : null;
      candidate.candidate_controlled_committee_name =
        candidateWithInfo?.committeeNameOverride
          ? candidateWithInfo?.committeeNameOverride
          : candidate.candidate_controlled_committee_name;
    }

    return candidates;
  }

  private async getAllCandidates(): Promise<CandidateEntity[]> {
    return await this.connection
      .getRepository(CandidateEntity)
      .createQueryBuilder()
      .getMany();
  }
}
