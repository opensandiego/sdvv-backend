import { Injectable } from '@nestjs/common';
import { TransactionEntity } from 'apps/sdvv-backend-nest/src/transactions/transactions.entity';
import { Connection } from 'typeorm';
import { F460DEntity } from '../f460d/f460d.entity';

@Injectable()
export class UpdateIndepExpnService {
  constructor(private connection: Connection) {}

  async setTransactionsSupOpp() {
    const transactionsF460D = await this.getF460DTransactionsWithSupOpp();
    await this.updateTransactionsWithSupOpp(transactionsF460D);
    console.log('setTransactionsSupOpp: completed');
  }

  async updateTransactionsWithSupOpp(f460ds) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();

    for await (const f460d of f460ds) {
      await queryRunner.manager
        .getRepository(TransactionEntity)
        .createQueryBuilder()
        .update()
        .set({
          sup_opp_cd: f460d.supp_opp_cd,
        })
        .where('e_filing_id = :eFilingID', { eFilingID: f460d.e_filing_id })
        .andWhere('tran_id = :tranID', { tranID: f460d.tran_id })
        .andWhere('schedule = :schedule', { schedule: f460d.form_type })
        .execute();
    }

    await queryRunner.release();
  }

  async getF460DTransactionsWithSupOpp() {
    return await this.connection
      .getRepository(F460DEntity)
      .createQueryBuilder()
      .select('e_filing_id')
      .addSelect('tran_id')
      .addSelect('form_type')
      .addSelect('supp_opp_cd')
      .where('rec_type = :recType', { recType: 'EXPN' })
      .andWhere('form_type = :formType', { formType: 'D' })
      .andWhere('supp_opp_cd IS NOT NULL')
      .getRawMany();
  }
}
