import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { RCPTEntity } from '../../tables-xlsx/rcpt/rcpt.entity';

@Injectable()
export class ContributionService {
  constructor(private dataSource: DataSource) {}

  private RCPTTypes = ['A', 'C'];

  async getContributions({ committeeName, filters, limit = 20 }) {
    const query = this.dataSource
      .getRepository(RCPTEntity)
      .createQueryBuilder()
      .addSelect(`COALESCE(ROUND(amount), 0)::int`, 'amount')
      .addSelect(`CONCAT(ctrib_naml, ', ', ctrib_namf)`, 'name')
      .addSelect(`ctrib_namf`, 'firstName')
      .addSelect(`ctrib_naml`, 'lastName')
      .addSelect(`rcpt_date`, 'date') // format this date
      .addSelect(`filer_naml`, 'committee')
      .addSelect(`tran_id`, 'tranId')
      .addSelect(`ctrib_city`, 'city')
      .addSelect(`ctrib_st`, 'state')
      .addSelect(`ctrib_zip4`, 'zip')
      .addSelect(`ctrib_emp`, 'employer')
      .addSelect(`ctrib_occ`, 'occupation')

      .andWhere('filer_naml iLike :committeeName', { committeeName })
      .andWhere('rec_type = :recType', { recType: 'RCPT' })
      .andWhere('form_type IN (:...formType)', { formType: this.RCPTTypes });

    if (filters.firstName) {
      query.andWhere('ctrib_namf = :firstName', {
        firstName: filters.firstName,
      });
    }

    if (filters.lastName) {
      query.andWhere('ctrib_naml = :lastName', {
        lastName: filters.lastName,
      });
    }

    if (filters.lastFirstName) {
      query.andWhere(`CONCAT(ctrib_naml, ', ', ctrib_namf) = :name`, {
        name: filters.lastFirstName,
      });
    }

    if (filters.zipCodes) {
      query.andWhere('ctrib_zip4 IN (:...zipCodes)', {
        zipCodes: filters.zipCodes,
      });
    }

    if (filters.employers) {
      query.andWhere('ctrib_emp IN (:...employers)', {
        employers: filters.employers,
      });
    }

    if (filters.occupations) {
      query.andWhere('ctrib_occ IN (:...occupations)', {
        occupations: filters.occupations,
      });
    }

    if (limit > 0) {
      query.limit(limit);
    }

    const groups = await query.getRawMany();
    return groups;
  }
}
