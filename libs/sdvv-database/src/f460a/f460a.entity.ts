import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'f460a' })
export class F460AEntity {
  // From common.dto
  @Column()
  filer_id: string;

  @Column()
  filer_naml: string;

  @Column()
  report_num: string;

  @PrimaryColumn()
  e_filing_id: string;

  @Column()
  orig_e_filing_id: string;

  @Column()
  cmtte_type: string;

  @Column()
  rpt_date: string;

  @Column()
  from_date: string;

  @Column()
  thru_date: string;

  @Column({ nullable: true })
  elect_date: string;

  // From rcpt.dto
  @Column()
  rec_type: string;

  @PrimaryColumn()
  form_type: string;

  @PrimaryColumn()
  tran_id: string;

  @Column()
  entity_cd: string;

  @Column()
  ctrib_naml: string;

  @Column({ nullable: true })
  ctrib_namf: string;

  @Column({ nullable: true })
  ctrib_namt: string;

  @Column({ nullable: true })
  ctrib_nams: string;

  @Column({ nullable: true })
  ctrib_adr1: string;

  @Column({ nullable: true })
  ctrib_adr2: string;

  @Column({ nullable: true })
  ctrib_city: string;

  @Column({ nullable: true })
  ctrib_st: string;

  @Column({ nullable: true })
  ctrib_zip4: string;

  @Column({ nullable: true })
  ctrib_emp: string;

  @Column({ nullable: true })
  ctrib_occ: string;

  @Column()
  ctrib_self: boolean;

  @Column({ nullable: true })
  tran_type: string;

  @Column()
  rcpt_date: string;

  @Column({ nullable: true })
  date_thru: string;

  @Column({ type: 'numeric' })
  amount: number;

  @Column({ type: 'numeric' })
  cum_ytd: number;

  @Column({ nullable: true })
  ctrib_dscr: string;

  @Column({ nullable: true })
  cmte_id: string;

  @Column({ nullable: true })
  tres_naml: string;

  @Column({ nullable: true })
  tres_namf: string;

  @Column({ nullable: true })
  tres_namt: string;

  @Column({ nullable: true })
  tres_nams: string;

  @Column({ nullable: true })
  tres_adr1: string;

  @Column({ nullable: true })
  tres_adr2: string;

  @Column({ nullable: true })
  tres_city: string;

  @Column({ nullable: true })
  tres_st: string;

  @Column({ nullable: true })
  tres_zip4: string;

  @Column({ nullable: true })
  intr_naml: string;

  @Column({ nullable: true })
  intr_namf: string;

  @Column({ nullable: true })
  intr_namt: string;

  @Column({ nullable: true })
  intr_nams: string;

  @Column({ nullable: true })
  intr_adr1: string;

  @Column({ nullable: true })
  intr_adr2: string;

  @Column({ nullable: true })
  intr_city: string;

  @Column({ nullable: true })
  intr_st: string;

  @Column({ nullable: true })
  intr_zip4: string;

  @Column({ nullable: true })
  intr_emp: string;

  @Column({ nullable: true })
  intr_occ: string;

  @Column()
  intr_self: boolean;

  @Column()
  memo_code: boolean;

  @Column({ nullable: true })
  memo_refno: string;

  @Column({ nullable: true })
  bakref_tid: string;

  @Column({ nullable: true })
  xref_schnm: string;

  @Column({ nullable: true })
  xref_match: string;

  @Column({ nullable: true })
  int_rate: string;

  @Column({ nullable: true })
  int_cmteid: string;

  // Added fields that are not in the XLSX file.
  @Column({ nullable: true })
  xlsx_file_year: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
