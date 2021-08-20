import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Filing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filing_id: string;

  @Column()
  doc_public: string | null;

  @Column()
  period_end: string | null;

  @Column()
  filing_type: string;

  @Column()
  e_filing_id: string;

  @Column()
  filing_date: string;

  @Column()
  amendment: boolean;

  @Column()
  amends_orig_id: string | object | null;

  @Column()
  amends_prev_id: object | null;

  @Column()
  amendment_number: number;

  @Column()
  filing_subtypes: string | null;

  @Column()
  entity_name: string;



  @Column()
  coe_id?: string;

  @Column()
  entity_id?: string;

  @Column()
  name?: string;

  @Column()
  name_first?: string | null;

  @Column()
  name_title?: string | null;

  @Column()
  name_suffix?: string | null;

  @Column()
  form_name?: string | null;



  @Column()
  period_start?: string | null;

  @Column()
  amendment_type?: string | number;

  @Column()
  covers_period?: string;

  @Column()
  form?: string | null;

  
  // Fields below are not from eFile
  @Column()
  filing_date_time: string;

  @Column()
  enabled: boolean;
  
}
