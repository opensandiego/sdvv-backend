import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { EXPNEntity } from '@app/sdvv-database/tables-xlsx/expn/expn.entity';
import { S496Entity } from '@app/sdvv-database/tables-xlsx/s496/s496.entity';
import { CandidateIndependentExpenditures } from './interfaces/independent-expenditures.interface';
import { CandidateEntity } from '@app/sdvv-database/candidate/candidates.entity';

const dayjs = require('dayjs');
var customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

@Injectable()
export class CandidateIndependentExpendituresService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(EXPNEntity)
    private readonly expnRepository: Repository<EXPNEntity>,
    @InjectRepository(S496Entity)
    private readonly s496Repository: Repository<S496Entity>,
    @InjectRepository(CandidateEntity)
    private readonly candidateRepository: Repository<CandidateEntity>,
  ) {}

  private monthsNum = 24;

  getIndependentExpenditureBaseQuery({ year }: { year?: string }) {
    const formTypeF460D = { formTypeF460D: 'D' };

    const expnQuery = this.expnRepository
      .createQueryBuilder('expn')
      .select('expn.id', 'id')
      .addSelect('expn.filer_id', 'filer_id')
      .addSelect(
        `CONCAT_WS(' ', NULLIF(expn.cand_namf, ''), NULLIF(expn.cand_naml, ''))`,
        'candidate_full_name',
      )
      .addSelect('expn.supp_opp_cd', 'supp_opp_cd')
      .addSelect('expn.filer_naml', 'filer_naml')
      .addSelect('expn.form_type', 'form_type')
      .addSelect('expn.amount', 'amount')
      .addSelect('expn.expn_date :: text', 'expn_date')
      .where(`expn.form_type = :formTypeF460D`, formTypeF460D);

    const s496Query = this.s496Repository
      .createQueryBuilder('s496')
      .select('s496.id', 'id')
      .addSelect('s496.filer_id', 'filer_id')
      .addSelect(
        `CONCAT_WS(' ', NULLIF(s496.cand_namf, ''), NULLIF(s496.cand_naml, ''))`,
        'candidate_full_name',
      )
      .addSelect('s496.supp_opp_cd', 'supp_opp_cd')
      .addSelect('s496.filer_naml', 'filer_naml')
      .addSelect('s496.form_type', 'form_type')
      .addSelect('s496.amount', 'amount')
      .addSelect('s496.exp_date :: text', 'expn_date')
      .andWhere(`s496.form_type = :formTypeS496`, { formTypeS496: 'F496' })

      // only include s496 transactions with (exp_date)
      //  after the most recent Form 460 D (thru_date) this is to exclude
      //  transactions that should have already been on a F460 filing
      .andWhere(
        `s496.exp_date > (SELECT MAX(expn.thru_date)
          FROM expn expn 
          WHERE expn.form_type = :formTypeF460D
        )`,
        formTypeF460D,
      );

    if (year) {
      // filter for transactions with data between end of
      // election year (endDate) and a number of months
      // in the past (startDate)

      const endMoment = dayjs(`${year}1231`, 'YYYYMMDD');
      const startMoment = endMoment.subtract(this.monthsNum, 'months');

      const endDate = endMoment.format('YYYYMMDD');
      const startDate = startMoment.format('YYYYMMDD');
      const params = { startDate, endDate };

      expnQuery.andWhere(
        'expn.expn_date BETWEEN :startDate AND :endDate',
        params,
      );

      s496Query.andWhere(
        's496.exp_date BETWEEN :startDate AND :endDate',
        params,
      );
    }

    const unionSql = `(${expnQuery.getQuery()}) UNION ALL (${s496Query.getQuery()})`;

    const finalQuery = this.dataSource
      .createQueryBuilder()
      .from(`(${unionSql})`, 'combined')
      .select('MAX(combined.candidate_full_name)', 'candidate_full_name')
      .addSelect('MAX(combined.filer_id)', 'filer_id')
      .addSelect('combined.form_type', 'form_type')
      .addSelect('combined.filer_naml', 'filer_naml')
      .addSelect('combined.supp_opp_cd', 'supp_opp_cd')
      .addSelect('SUM(combined.amount)', 'amount')
      .addSelect('COUNT(combined.amount)', 'transaction_count')

      .where(
        `combined.candidate_full_name IS NOT NULL AND combined.candidate_full_name <> ''`,
      )

      // groups transactions to return a list of groups
      // not a list of transactions
      .groupBy('UPPER(combined.candidate_full_name)')
      .addGroupBy('combined.form_type')
      .addGroupBy('combined.filer_naml')
      .addGroupBy('combined.supp_opp_cd')

      .setParameters({
        ...expnQuery.getParameters(),
        ...s496Query.getParameters(),
      });

    return finalQuery;
  }

  async getIndependentExpendituresCandidates({
    year,
    office,
    district,
  }: {
    year?: string;
    office?: string;
    district?: string;
  }) {
    // replaces dashes '-' in office name with spaces
    office = office?.split('-').join(' ');

    const subQuery = this.getIndependentExpenditureBaseQuery({ year });

    const query = this.candidateRepository
      .createQueryBuilder('c')
      .leftJoinAndSelect(
        `(${subQuery.getQuery()})`,
        'combined',
        'LOWER(combined.candidate_full_name) = LOWER(c.candidate_name)',
        subQuery.getParameters(),
      )

      .select('MAX(c.candidate_id)', 'candidateId')
      .addSelect('MAX(c.candidate_name)', 'candidateName')
      .addSelect('bool_or(c.in_primary_election)', 'inPrimaryElection')
      .addSelect('bool_or(c.in_general_election)', 'inGeneralElection')
      .addSelect('MAX(c.office)', 'office')
      .addSelect('MAX(c.district)', 'district')

      .addSelect('combined.filer_id', 'filer_id')
      .addSelect('combined.form_type', 'form_type')
      .addSelect('combined.filer_naml', 'filer_naml')
      .addSelect('combined.supp_opp_cd', 'supp_opp_cd')

      .addSelect('SUM(combined.amount)', 'amount')
      .addSelect('MAX(combined.transaction_count)', 'transaction_count')
      .addSelect('MAX(combined.candidate_full_name)', 'candidate_full_name')

      .addGroupBy('c.candidate_id')
      .addGroupBy('combined.filer_id')
      .addGroupBy('combined.form_type')
      .addGroupBy('combined.filer_naml')
      .addGroupBy('combined.supp_opp_cd')

      .addOrderBy('amount', 'ASC');

    if (year) {
      query.andWhere('c.election_year = :year', { year });
    }
    if (office) {
      query.andWhere('LOWER(c.office) = LOWER(:office)', { office });
    }
    if (district) {
      query.andWhere('c.district = :district', { district });
    }

    const rows = await query.getRawMany();
    // return rows as any; // for debugging

    return this.processRawData({ rawData: rows });
  }

  processRawData({ rawData }: { rawData: any[] }) {
    const candidateMap = new Map<string, CandidateIndependentExpenditures>();

    const rawRows = rawData as {
      candidateId: string; // from candidate table
      candidate_full_name: string; // from transaction table
      candidateName: string; // from candidate table
      inPrimaryElection: boolean; // from candidate table
      inGeneralElection: boolean; // from candidate table
      filer_naml: string;
      supp_opp_cd: 'SUPPORT' | 'OPPOSE';
      form_type: 'D' | 'F496';
      amount: string;
    }[];

    rawRows.forEach((row) => {
      // if candidate does not exist in map then add candidate to map
      if (!candidateMap.has(row.candidateId)) {
        candidateMap.set(row.candidateId, {
          candidateId: row.candidateId,
          // candidateName: row.candidate_full_name, // from transaction but may not match candidate name
          candidateName: row.candidateName,
          inPrimaryElection: row.inPrimaryElection,
          inGeneralElection: row.inGeneralElection,
          f460d: {
            support: [],
            oppose: [],
          },
          s496: {
            support: [],
            oppose: [],
          },
        });
      }

      // get candidate from map
      const candidate = candidateMap.get(row.candidateId);
      if (!candidate) return; // skip adding filer if not found

      const filer = {
        filerName: row.filer_naml,
        amount: parseFloat(row.amount) || 0,
      };

      // add filer's independent expenditures to correct list
      // based on fields: form_type and supp_opp_cd
      if (row.form_type === 'D' && row.supp_opp_cd === 'SUPPORT') {
        candidate.f460d.support.push(filer);
      } else if (row.form_type === 'D' && row.supp_opp_cd === 'OPPOSE') {
        candidate.f460d.oppose.push(filer);
      } else if (row.form_type === 'F496' && row.supp_opp_cd === 'SUPPORT') {
        candidate.s496.support.push(filer);
      } else if (row.form_type === 'F496' && row.supp_opp_cd === 'OPPOSE') {
        candidate.s496.oppose.push(filer);
      }
    });

    return Array.from(candidateMap.values());
  }
}
