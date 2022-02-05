import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Candidate } from 'apps/sdvv-backend-nest/src/api/interfaces/candidate';
import { CandidateEntity } from '../tables/entity/candidates.entity';
import { RCPTEntity } from '@app/sdvv-database/tables-xlsx/rcpt/rcpt.entity';

@Injectable()
export class CandidateService {
  constructor(private connection: Connection) {}

  validOffices = ['Mayor', 'City Council', 'City Attorney'];

  async getCandidates({ year = '0', office = '', district = '' } = {}): Promise<
    Candidate[]
  > {
    const query = this.connection
      .getRepository(CandidateEntity)
      .createQueryBuilder()
      .select('candidate_id', 'id')
      .addSelect(`CONCAT( first_name, ' ',  last_name )`, 'full_name')
      .addSelect('description')
      .addSelect('image_url')
      .addSelect('website')
      .addSelect('agency')
      .addSelect('office')
      .addSelect('district')
      .addSelect('election_year', 'year')
      .addSelect('in_general_election')
      .addSelect('full_office_name')
      .addSelect((subQuery1) => {
        return subQuery1
          .select('COALESCE(SUM(amount), 0)', 'sum')
          .from(RCPTEntity, 'transaction')
          .where('filer_naml iLike candidate_controlled_committee_name')
          .andWhere('rec_type = :recType', { recType: 'RCPT' });
      }, 'total_contributions')
      .addSelect((subQuery2) => {
        return subQuery2
          .select('COUNT( DISTINCT (ctrib_naml || ctrib_namf))', 'counts')
          .from(RCPTEntity, 'transaction')
          .where('filer_naml iLike candidate_controlled_committee_name')
          .andWhere('rec_type = :recType', { recType: 'RCPT' });
      }, 'contributor_count')

      .where('office IN (:...cityOffices)', {
        cityOffices: this.validOffices,
      });

    if (year !== '0') {
      query.andWhere('election_year = :year', { year });
    }

    if (office) {
      query.andWhere('LOWER(office) = LOWER(:office)', { office });
    }

    if (district) {
      query.andWhere('district = :district', { district });
    }

    query.addOrderBy('office', 'DESC');
    query.addOrderBy('district', 'ASC');
    query.addOrderBy('last_name', 'ASC');

    const candidates = await query.getRawMany();

    candidates.forEach((candidate) => {
      candidate.jurisdiction = candidate.district ? 'District' : 'City';
    });

    const candidatesWithContributions = candidates.filter(
      (candidate) => parseInt(candidate.total_contributions) > 0,
    );

    return candidatesWithContributions;
  }
}
