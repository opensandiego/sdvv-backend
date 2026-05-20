import { Injectable } from '@nestjs/common';
import {
  DataSource,
  UpdateQueryBuilder,
  WhereExpressionBuilder,
} from 'typeorm';
import { CandidateEntity } from '@app/sdvv-database/candidate/candidates.entity';
import { EXPNEntity } from '@app/sdvv-database/tables-xlsx/expn/expn.entity';
import { S496Entity } from '@app/sdvv-database/tables-xlsx/s496/s496.entity';

const dayjs = require('dayjs');
var customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

@Injectable()
export class UpdateTransactionsReferencesService {
  constructor(private dataSource: DataSource) {}

  private filterByYear({
    query,
    columnPath,
    year,
    pastMonthsLimit = 24,
  }: {
    query: WhereExpressionBuilder;
    columnPath: string;
    year: string;
    // the number of months in the past to include within the filter
    pastMonthsLimit?: number;
  }): void {
    const endMoment = dayjs(`${year}1231`, 'YYYYMMDD');
    const startMoment = endMoment.subtract(pastMonthsLimit, 'months');

    const endDate = endMoment.format('YYYYMMDD');
    const startDate = startMoment.format('YYYYMMDD');

    // Detect if the query is an UPDATE query
    const isUpdate = query instanceof UpdateQueryBuilder;

    // If it is an update and contains a dot (e.g., 'expn.expn_date'), strip the alias prefix
    const finalColumnPath =
      isUpdate && columnPath.includes('.')
        ? columnPath.split('.')[1]
        : columnPath;

    query.andWhere(`${finalColumnPath} BETWEEN :startDate AND :endDate`, {
      startDate,
      endDate,
    });
  }

  async addCandidateReferencesToExpenses() {
    const candidateRepository = this.dataSource.getRepository(CandidateEntity);

    const candidates = await candidateRepository.find({
      order: { candidate_controlled_committee_name: 'ASC' },
    });

    for await (const candidate of candidates) {
      // Since 'City Council' elections for a district are every
      // 4 years use longer time range for filtering
      const pastMonthsLimit =
        candidate.office.toLowerCase() === 'city council' ? 48 : 24;

      let candidateNames = [candidate.candidate_name];

      if (candidate.alternate_candidate_names) {
        candidateNames.push(...candidate.alternate_candidate_names);
      }

      candidateNames = candidateNames.map((name) => name.toLowerCase());
      const year = candidate.election_year;

      // update all matching rows in s496
      const s496Update = this.dataSource
        .getRepository(S496Entity)
        .createQueryBuilder('s496')
        .update(S496Entity)
        .set({ candidate_supp_opp: { candidate_id: candidate.candidate_id } }) // The single value to set for all rows
        .andWhere(
          "LOWER(CONCAT_WS(' ', NULLIF(s496.cand_namf, ''), NULLIF(s496.cand_naml, ''))) IN (:...names)",
          { names: candidateNames },
        );

      this.filterByYear({
        year,
        columnPath: 's496.exp_date',
        query: s496Update,
        pastMonthsLimit,
      });

      await s496Update.execute();

      // update all matching rows in expn
      const expnUpdate = this.dataSource
        .getRepository(EXPNEntity)
        .createQueryBuilder('expn')
        .update(EXPNEntity)
        .set({ candidate_supp_opp: { candidate_id: candidate.candidate_id } })
        .where('expn.form_type = :formTypeEXPN', {
          formTypeEXPN: 'D',
        })
        .andWhere(
          "LOWER(CONCAT_WS(' ', NULLIF(expn.cand_namf, ''), NULLIF(expn.cand_naml, ''))) IN (:...names)",
          { names: candidateNames },
        );

      this.filterByYear({
        year,
        columnPath: 'expn.expn_date',
        query: expnUpdate,
        pastMonthsLimit,
      });

      await expnUpdate.execute();
    }
  }
}
