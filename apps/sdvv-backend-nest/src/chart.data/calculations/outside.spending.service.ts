import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { TransactionEntity } from '@app/efile-api-data/tables/entity/transactions.entity';

@Injectable()
export class OutsideSpendingService {
  constructor(private connection: Connection) {}

  async support(candidateName: string) {
    const { sum: supportSum } = await this.connection
      .getRepository(TransactionEntity)
      .createQueryBuilder()
      .select('SUM(amount)', 'sum')
      .where('include_in_calculations = true')
      .andWhere('tx_type = :txType', { txType: 'EXPN' })
      .andWhere('filing_type= :filingType', { filingType: 'FPPC 496' })
      .andWhere('name = :candidateName', { candidateName: candidateName })
      .andWhere('spending_code = :spendingCode', { spendingCode: 'IND' }) // is this correct?
      // what field can be used to determine support/opposed status
      .getRawOne();

    return supportSum;
  }

  async opposed() {}
}

// {
//   "filer_name": "San Diego County Democratic Party",
//   "doc_public": "Ext_d14aad5a-ba2a-43fa-8ea2-ebe6041e4225",
//   "e_filing_id": "300050462",
//   "tran_id": "NON2701",
//   "transaction_date": "10/16/2020",
//   "amount": "$1,143",
//   "tx_type": "RCPT",
//   "schedule": "F496P3",
//   "filing_id": "d14aad5a-ba2a-43fa-8ea2-ebe6041e4225",
//   "filing_type": "FPPC 496",
//   "name": "Service Employees International Union Local 221",
//   "intr_name": "",
//   "city": "San Diego",
//   "state": "CA",
//   "zip": "92111",
//   "spending_code": "In-Kind, Staff Time",
//   "employer": null,
//   "occupation": null
// }
