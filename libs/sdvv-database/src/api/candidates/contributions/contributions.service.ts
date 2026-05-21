import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RCPTEntity } from '@app/sdvv-database/tables-xlsx/rcpt/rcpt.entity';
import {
  CandidateContributionsByLocation,
  ContributionsByForm,
} from './interfaces/candidate-contributions.interface';
import { CandidateEntity } from '@app/sdvv-database/candidate/candidates.entity';

const dayjs = require('dayjs');
var customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

@Injectable()
export class CandidateContributionsService {
  constructor(
    @InjectRepository(RCPTEntity)
    private readonly rcptRepository: Repository<RCPTEntity>,
    @InjectRepository(CandidateEntity)
    private readonly candidateRepository: Repository<CandidateEntity>,
  ) {}

  private monthsNum = 24;

  async getContributionsByInOutCity({
    district,
    office,
    year,
    targetCity = 'San Diego',
    targetState = 'CA',
  }: {
    year?: string;
    office?: string;
    district?: string;
    targetCity?: string;
    targetState?: string;
  }) {
    // replace '-' with spaces
    office = office?.split('-').join(' ');

    // subQuery is used to retrieve all candidates not just those with transactions
    const subQuery = this.rcptRepository.createQueryBuilder('rcpt').select('*');

    if (year) {
      // filter for transactions with data between end of
      // election year (endDate) and a number of months
      // in the past (startDate)

      const endMoment = dayjs(`${year}1231`, 'YYYYMMDD');
      const startMoment = endMoment.subtract(this.monthsNum, 'months');

      const endDate = endMoment.format('YYYYMMDD');
      const startDate = startMoment.format('YYYYMMDD');
      const params = { startDate, endDate };

      subQuery.andWhere(
        'rcpt.rcpt_date BETWEEN :startDate AND :endDate',
        params,
      );
    }

    const query = this.candidateRepository
      .createQueryBuilder('c')
      .leftJoinAndSelect(
        `(${subQuery.getQuery()})`,
        'rcpt',
        'LOWER(rcpt.filer_naml) = LOWER(c.candidate_controlled_committee_name)',
        subQuery.getParameters(),
      )
      .select('c.candidate_id', 'candidateId')
      .addSelect('c.candidate_name', 'candidateName')
      .addSelect('MAX(c.candidate_controlled_committee_name)', 'committeeName')
      .addSelect('bool_or(c.in_primary_election)', 'inPrimaryElection')
      .addSelect('bool_or(c.in_general_election)', 'inGeneralElection')
      .addSelect('MAX(c.election_year)', 'electionYear')
      .addSelect('MAX(c.office)', 'office')
      .addSelect('MAX(c.district)', 'district')
      .addSelect('MAX(rcpt.form_type)', 'formType')
      .addSelect('SUM(rcpt.amount)', 'totalSum')
      .addSelect('COUNT(rcpt.amount)', 'totalCount') // count of transactions
      .addSelect(
        `
            CASE
              WHEN REPLACE(LOWER(rcpt.ctrib_city), ' ', '') = REPLACE(LOWER(:city), ' ', '') AND REPLACE(LOWER(rcpt.ctrib_st), ' ', '') = LOWER(:state) THEN 'in-city'
              ELSE 'out-city'
            END`,
        'location',
      )
      .setParameters({ city: targetCity, state: targetState })

      .where('c.candidate_controlled_committee_name IS NOT NULL')
      .groupBy('c.candidate_id')
      .addGroupBy('c.candidate_name')
      // group by 'form_type' = monetary (A), non-monetary (C), late (F496P3) contributions
      .addGroupBy('rcpt.form_type')
      .addGroupBy('location')

      .addOrderBy('c.candidate_id', 'ASC');

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
    const candidateMap = new Map<string, CandidateContributionsByLocation>();

    const rawRows = rawData as {
      candidateId: string;
      committeeName: string;
      candidateName: string;
      inPrimaryElection: boolean;
      inGeneralElection: boolean;
      year: string;
      office: string;
      district: string | undefined;
      formType: 'A' | 'C' | 'F496P3';
      totalSum: string;
      totalCount: string;
      location: 'in-city' | 'out-city';
    }[];

    const template = {
      inCity: 0,
      outCity: 0,
      formContributions: 0,
      formTransactionCount: 0,
    };

    rawRows.forEach((row) => {
      // if candidate does not exist in map then add candidate to map
      if (!candidateMap.has(row.candidateId)) {
        candidateMap.set(row.candidateId, {
          candidateId: row.candidateId,
          candidateName: row.candidateName,
          committeeName: row.committeeName,
          office: row.office,
          district: row.district,
          year: row.year,
          inPrimaryElection: row.inPrimaryElection,
          inGeneralElection: row.inGeneralElection,
          f460a: { ...template },
          f460c: { ...template },
          f496p3: { ...template },
          totalContributions: 0,
          transactionCount: 0,
        });
      }

      const candidate = candidateMap.get(row.candidateId);
      if (!candidate) return; // skip if not found

      const sum = parseFloat(row.totalSum) || 0;
      const count = parseFloat(row.totalCount) || 0;

      let formType: ContributionsByForm | undefined;

      if (row.formType === 'A') {
        formType = candidate.f460a;
      } else if (row.formType === 'C') {
        formType = candidate.f460c;
      } else if (row.formType === 'F496P3') {
        formType = candidate.f496p3;
      }

      if (!formType) return; // skip if not found

      if (row.location === 'in-city') {
        formType.inCity += sum;
      } else if (row.location === 'out-city') {
        formType.outCity += sum;
      }

      // Increment the form totals regardless of location
      formType.formContributions += sum;
      formType.formTransactionCount += count;

      // Increment the candidate totals regardless of form
      candidate.totalContributions += sum;
      candidate.transactionCount += count;
    });

    return Array.from(candidateMap.values()).sort(
      (a, b) => b.totalContributions - a.totalContributions,
    );
  }
}
