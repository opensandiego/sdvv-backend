import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @Column({ nullable: true })
  intr_name: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  zip: string;

  @Column({ nullable: true })
  spending_code: string;

  @Column({ nullable: true })
  employer: string;

  @Column({ nullable: true })
  occupation: string;

  // Fields below are not from eFile
  @Column()
  transaction_date_time: string;

  @Column({ default: false })
  has_been_processed: boolean;

  @Column({ default: false })
  include_in_calculations: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
