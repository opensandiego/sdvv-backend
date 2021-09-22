import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { TransactionEntity } from 'src/transactions/transactions.entity';
// import { CandidateEntity } from 'src/candidates/candidates.entity';

@Injectable()
export class ContributionsMethodService {
  constructor(private connection: Connection) {}

  async getRaisedNonIndividual(filerName: string) {
    const contributionsNonIndividualList = await this.connection
      .getRepository(TransactionEntity)
      .createQueryBuilder()
      .select('employer')
      .addSelect('occupation')
      .addSelect('spending_code')
      .where('include_in_calculations = true')
      .andWhere('filer_name = :filerName', { filerName: filerName })
      .andWhere('tx_type = :txType', { txType: 'RCPT' })
      // how are Non-Individual contributions indicated
      .andWhere('(employer = :na AND occupation = :na)', { na: 'N/A' })
      .andWhere('NOT (employer IS NULL AND occupation IS NULL)') // this might be optional
      .getRawMany();

    console.log(
      'contributionsNonIndividualList.length',
      contributionsNonIndividualList.length,
    );
    return contributionsNonIndividualList;
  }

  async getRaisedNonIndividualSum(filerName: string) {
    const contributionsNonIndividualSum = await this.connection
      .getRepository(TransactionEntity)
      .createQueryBuilder()
      .select('SUM(amount)', 'sum')
      .where('include_in_calculations = true')
      .andWhere('filer_name = :filerName', { filerName: filerName })
      .andWhere('tx_type = :txType', { txType: 'RCPT' })
      // how are Non-Individual contributions indicated
      .andWhere('(employer = :na AND occupation = :na)', { na: 'N/A' })
      .andWhere('NOT (employer IS NULL AND occupation IS NULL)') // this might be optional
      .getRawOne();

    console.log('contributionsNonIndividualSum', contributionsNonIndividualSum);
    return contributionsNonIndividualSum;
  }

  async getRaisedIndividual(filerName: string) {
    const contributionsIndividualList = await this.connection
      .getRepository(TransactionEntity)
      .createQueryBuilder()
      .select('employer')
      .addSelect('occupation')
      .addSelect('spending_code')
      .where('include_in_calculations = true')
      .andWhere('filer_name = :filerName', { filerName: filerName })
      .andWhere('tx_type = :txType', { txType: 'RCPT' })
      // how are Individual contributions indicated
      .andWhere('NOT (employer = :na AND occupation = :na)', { na: 'N/A' })
      .andWhere('NOT (employer IS NULL AND occupation IS NULL)') // this might be optional
      .getRawMany();

    console.log(
      'contributionsIndividualList.length',
      contributionsIndividualList.length,
    );
    return contributionsIndividualList;
  }

  async getRaisedIndividualSum(filerName: string) {
    const { sum: contributionsIndividualSum } = await this.connection
      .getRepository(TransactionEntity)
      .createQueryBuilder()
      .select('SUM(amount)', 'sum')
      // .select('employer')
      // .addSelect('occupation')
      .where('include_in_calculations = true')
      .andWhere('filer_name = :filerName', { filerName: filerName })
      .andWhere('tx_type = :txType', { txType: 'RCPT' })
      // how are Individual contributions indicated
      .andWhere('NOT (employer = :na AND occupation = :na)', { na: 'N/A' })
      .andWhere('NOT (employer IS NULL AND occupation IS NULL)')
      .getRawOne();

    console.log('contributionsIndividualSum', contributionsIndividualSum);
    return contributionsIndividualSum;
  }

  async getRaisedInKindSum(filerName: string) {
    const { sum: contributionsInKindSum } = await this.connection
      .getRepository(TransactionEntity)
      .createQueryBuilder()
      .select('SUM(amount)', 'sum')
      .where('include_in_calculations = true')
      .andWhere('filer_name = :filerName', { filerName: filerName })
      .andWhere('schedule IN (:...schedules)', { schedules: ['F496P3'] })
      .andWhere('spending_code iLike :spendingCode', {
        spendingCode: '%In-Kind%',
      })
      .getRawOne();

    console.log('getRaisedInKindSum result', contributionsInKindSum);
    return contributionsInKindSum;
  }

  async getRaisedInKind(filerName: string) {
    const list = await this.connection
      .getRepository(TransactionEntity)
      .createQueryBuilder()
      .where('include_in_calculations = true')
      .andWhere('filer_name = :filerName', { filerName: filerName })
      .andWhere('schedule IN (:...schedules)', { schedules: ['F496P3'] })
      .andWhere('spending_code iLike :spendingCode', {
        spendingCode: '%In-Kind%',
      })
      .getRawMany();

    console.log('getRaisedInKind result', list);
    return list;
  }
}
