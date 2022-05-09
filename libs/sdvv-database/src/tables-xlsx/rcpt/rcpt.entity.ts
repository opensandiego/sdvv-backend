import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
/**
 * This table is for transactions of type contribution which have rec_type of RCPT.
 * The transactions are from sheets: F460-A-Contribs, F460-C-Contribs,
 * F460-I-MiscCashIncs, and F496-P3-Contribs.
 */
@Entity({ name: 'rcpt' })
export class RCPTEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // From common.dto
  @Column({ nullable: true })
  filer_id: string;

  @Column()
  filer_naml: string;

  @Column()
  report_num: string;

  @Column()
  e_filing_id: string;

  @Column()
  orig_e_filing_id: string;

  @Column({ nullable: true })
  cmtte_type: string;

  @Column()
  rpt_date: string;

  @Column({ nullable: true })
  from_date: string;

  @Column({ nullable: true })
  thru_date: string;

  @Column({ nullable: true })
  elect_date: string;

  // From rcpt.dto
  @Column()
  rec_type: string;

  /**
   * Values for form_type: A, C, I, F496P3
   * A: Schedule A Monetary Contributions Received
   * C: Schedule C - Nonmonetary Contributions Received
   * I: Schedule I - Miscellaneous Increases to Cash
   * F496P3: Contributions of $100 or More Received
   */
  @Column()
  form_type: string;

  @Column()
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

  @Column({ type: 'numeric', nullable: true })
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
  @Column()
  xlsx_file_year: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
