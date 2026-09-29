import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CandidateEntity } from '@app/sdvv-database/candidate/candidates.entity';
import { RCPTEntity } from '@app/sdvv-database/tables-xlsx/rcpt/rcpt.entity';
import { EXPNEntity } from '@app/sdvv-database/tables-xlsx/expn/expn.entity';
import { S496Entity } from '@app/sdvv-database/tables-xlsx/s496/s496.entity';
import { CityCouncilDistrictSpending } from './interfaces/city-council-districts-spending.interface';

const dayjs = require('dayjs');
var customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

@Injectable()
export class CityCouncilDistrictsSpendingService {
  constructor(
    @InjectRepository(CandidateEntity)
    private readonly candidateRepository: Repository<CandidateEntity>,
  ) {}

  private monthsNum = 24;

  getDateRange({ year }: { year: string }) {
    const endMoment = dayjs(`${year}1231`, 'YYYYMMDD');
    const startMoment = endMoment.subtract(this.monthsNum, 'months');

    const endDate = endMoment.format('YYYYMMDD');
    const startDate = startMoment.format('YYYYMMDD');
    return { startDate, endDate };
  }

  async getCityCouncilDistrictsSpending({
    electionYear,
  }: {
    electionYear: number;
  }) {
    const year = electionYear.toString();
    const { startDate, endDate } = this.getDateRange({ year });

    const query = this.candidateRepository
      .createQueryBuilder('c')
      .where('c.candidate_controlled_committee_name IS NOT NULL')
      .andWhere('c.election_year = :year', { year })
      .andWhere('LOWER(c.office) = LOWER(:office)', { office: 'City Council' })
      .leftJoin(
        // Form 460 Contributions
        (subQuery) => {
          return (
            subQuery
              .select('rcpt_t.filer_naml', `rcpt_filer_naml`)
              // 'A' = Monetary Contributions Received
              .addSelect(
                `SUM(rcpt_t.amount) FILTER (WHERE rcpt_t.form_type = 'A')`,
                'total_rcpt_a',
              )
              // 'C' = Nonmonetary Contributions Received
              .addSelect(
                `SUM(rcpt_t.amount) FILTER (WHERE rcpt_t.form_type = 'C')`,
                'total_rcpt_c',
              )
              // // 'I' = Miscellaneous Increases to Cash
              // .addSelect(
              //   `SUM(rcpt_t.amount) FILTER (WHERE rcpt_t.form_type = 'I')`,
              //   'total_rcpt_i',
              // )
              .from(RCPTEntity, 'rcpt_t') // transactions are in RCPT table
              .where('rcpt_t.rcpt_date BETWEEN :startDate AND :endDate', {
                startDate,
                endDate,
              })
              .groupBy('rcpt_t.filer_naml')
          );
        },
        't0', // Alias for subquery
        `LOWER(t0.rcpt_filer_naml) = LOWER(c.candidate_controlled_committee_name)`, // ON condition
      )
      .leftJoin(
        // Form 460 Independent Expenditure
        (subQuery) => {
          return (
            subQuery
              .select('t.candidateSuppOppCandidateId', `candidate_supp_opp_id`)
              // 'D' = Summary of Expenditures Supporting/Opposing Other
              //  Candidates, Measures and Committees
              .addSelect(
                `SUM(t.amount) FILTER (WHERE t.form_type = 'D')`,
                'total_expn_d',
              )
              .from(EXPNEntity, 't') // transactions are in EXPN table
              .where('t.candidateSuppOppCandidateId IS NOT NULL') // is this required
              .groupBy('t.candidateSuppOppCandidateId')
          );
        },
        't1', // Alias for subquery
        `t1.candidate_supp_opp_id = c.candidate_id`, // ON condition
      )
      .leftJoin(
        // Form 496 Late Independent Expenditures
        (subQuery) => {
          return (
            subQuery
              .select(
                'ts496.candidateSuppOppCandidateId',
                `candidate_supp_opp_id`,
              )
              // 'F496' = 24-hour/10-day Independent Expenditure
              .addSelect(
                `SUM(ts496.amount) FILTER (WHERE ts496.form_type = 'F496')`,
                'total_s496',
              )
              .from(S496Entity, 'ts496') // transactions are in s496 table
              .where('ts496.candidateSuppOppCandidateId IS NOT NULL') // is this required
              .andWhere(
                'ts496.is_duplicate IS NULL OR ts496.is_duplicate = :isDuplicate',
                { isDuplicate: false },
              )
              .groupBy('ts496.candidateSuppOppCandidateId')
          );
        },
        't2', // Alias for subquery
        `t2.candidate_supp_opp_id = c.candidate_id`, // ON condition
      )
      .select('c.district', 'district')

      .addSelect('COALESCE(SUM(t0.total_rcpt_a), 0)', 'totalRCPT_A')
      .addSelect('COALESCE(SUM(t0.total_rcpt_c), 0)', 'totalRCPT_C')
      // .addSelect('COALESCE(SUM(t0.total_rcpt_i), 0)', 'totalRCPT_I')
      .addSelect('COALESCE(SUM(t1.total_expn_d), 0)', 'totalEXPN_D')
      .addSelect('COALESCE(SUM(t2.total_s496), 0)', 'totalS496')

      .groupBy('c.district');

    const spendingByDistrict: {
      district: string;
      totalRCPT_A: string;
      totalRCPT_C: string;
      totalEXPN_D: string;
      totalS496: string;
    }[] = await query.getRawMany();

    // convert query output to API return format
    return (
      spendingByDistrict
        .map((district) => ({
          districtNumber: parseInt(district.district),
          contributions:
            parseFloat(district.totalRCPT_A) + parseFloat(district.totalRCPT_C),
          independentExpenditures:
            parseFloat(district.totalEXPN_D) + parseFloat(district.totalS496),
        }))
        // round numbers to 2 decimal places
        .map((district) => ({
          ...district,
          contributions: Math.round(district.contributions * 100) / 100,
          independentExpenditures:
            Math.round(district.independentExpenditures * 100) / 100,
        })) as CityCouncilDistrictSpending[]
    );
  }
}
