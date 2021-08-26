import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'filing' })
export class FilingEntity {
  @PrimaryColumn()
  filing_id: string;

  @Column({ nullable: true })
  doc_public: string;

  @Column({ nullable: true })
  period_end: string; //transform this before saving to db

  @Column()
  filing_type: string;

  @Column()
  e_filing_id: string;

  @Column()
  filing_date: string;

  @Column()
  amendment: boolean;

  @Column({ nullable: true })
  amends_orig_id: string;

  @Column({ nullable: true })
  amends_prev_id: string;

  @Column()
  amendment_number: number;

  @Column({ nullable: true })
  filing_subtypes: string;

  @Column()
  entity_name: string;

  // Fields below are not from eFile
  @Column()
  filing_date_time: string;

  @Column({ default: true })
  enabled: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
