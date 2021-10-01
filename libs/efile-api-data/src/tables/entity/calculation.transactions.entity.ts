import { ViewEntity, ViewColumn, Connection } from 'typeorm';
import { TransactionEntity } from './transactions.entity';

@ViewEntity({
  name: 'calcTransaction',
  expression: (connection: Connection) =>
    connection
      .getRepository(TransactionEntity)
      .createQueryBuilder()
      .select()
      .where('include_in_calculations IS TRUE'),
})
export class CalculationTransaction {
  @ViewColumn()
  filing_id: string;

  @ViewColumn()
  tran_id: string;

  @ViewColumn()
  filer_name: string;

  @ViewColumn()
  doc_public: string;

  @ViewColumn()
  e_filing_id: string;

  @ViewColumn()
  transaction_date: string;

  @ViewColumn()
  amount: number;

  @ViewColumn()
  tx_type: string;

  @ViewColumn()
  schedule: string;

  @ViewColumn()
  filing_type: string;

  @ViewColumn()
  name: string;

  @ViewColumn()
  intr_name: string;

  @ViewColumn()
  city: string;

  @ViewColumn()
  state: string;

  @ViewColumn()
  zip: string;

  @ViewColumn()
  spending_code: string;

  @ViewColumn()
  employer: string;

  @ViewColumn()
  occupation: string;

  @ViewColumn()
  transaction_date_time: string;

  @ViewColumn()
  zip5: string;

  @ViewColumn() // Values: SUPPORT | OPPOSE
  sup_opp_cd: string;

  // @ViewColumn() // remove this field after testing
  // include_in_calculations: boolean;
}
