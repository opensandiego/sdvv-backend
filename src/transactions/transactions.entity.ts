import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('transaction')
export class TransactionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // Fields below are from eFile
  @Column()
  filer_name: string;

  @Column()
  doc_public: string;

  @Column()
  e_filing_id: string;

  @Column()
  tran_id: string;

  @Column()
  transaction_date: string;

  @Column()
  amount: string;

  @Column()
  tx_type: string;

  @Column()
  schedule: string;

  @Column()
  filing_id: string;

  @Column()
  filing_type: string;

  @Column()
  name: string;

  @Column()
  intr_name: string | null;

  @Column()
  city: string | null;

  @Column()
  state: string | null;

  @Column()
  zip: string | null;

  @Column()
  spending_code: string | null;

  @Column()
  employer: string | null;

  @Column()
  occupation: string | null;

  // Fields below are not from eFile
  @Column()
  transaction_date_time: string;

  @Column()
  has_been_processed: boolean;

  @Column()
  include_in_calculations: boolean;
}
