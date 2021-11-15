import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
/**
 * This table is for transactions of type expenditures which have Rec_Type of EXPN.
 * The transactions are from sheets: F460-D-ContribIndepExpn, F460-E-Expenditures,
 * and F460-G-AgentPayments.
 */
@Entity({ name: 'expn' })
export class EXPNEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // From common.dto
  @Column()
  filer_id: string;

  @Column()
  filer_naml: string;

  @Column()
  report_num: string;

  @Column()
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

  // From expn.dto
  @Column()
  rec_type: string;

  /**
   * Values for form_type: D, E, G
   * D: Schedule D - Summary of Expenditures - Support/Oppose…
   * E: Schedule E - Payments Made
   * G: Schedule G - Payments Made "on behalf" of this Committee
   */
  @Column()
  form_type: string;

  @Column()
  tran_id: string;

  @Column({ nullable: true })
  entity_cd: string;

  @Column({ nullable: true })
  payee_naml: string;

  @Column({ nullable: true })
  payee_namf: string;

  @Column({ nullable: true })
  payee_namt: string;

  @Column({ nullable: true })
  payee_nams: string;

  @Column({ nullable: true })
  payee_adr1: string;

  @Column({ nullable: true })
  payee_adr2: string;

  @Column({ nullable: true })
  payee_city: string;

  @Column({ nullable: true })
  payee_st: string;

  @Column({ nullable: true })
  payee_zip4: string;

  @Column({ nullable: true })
  expn_date: string;

  @Column({ type: 'numeric' })
  amount: number;

  @Column({ type: 'numeric', nullable: true })
  cum_ytd: number;

  @Column({ nullable: true })
  expn_code: string;

  @Column({ nullable: true })
  expn_dscr: string;

  @Column({ nullable: true })
  agent_naml: string;

  @Column({ nullable: true })
  agent_namf: string;

  @Column({ nullable: true })
  agent_namt: string;

  @Column({ nullable: true })
  agent_nams: string;

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
  cand_naml: string;

  @Column({ nullable: true })
  cand_namf: string;

  @Column({ nullable: true })
  cand_namt: string;

  @Column({ nullable: true })
  cand_nams: string;

  @Column({ nullable: true })
  office_cd: string;

  @Column({ nullable: true })
  office_dscr: string;

  @Column({ nullable: true })
  juris_cd: string;

  @Column({ nullable: true })
  juris_dscr: string;

  @Column({ nullable: true })
  dist_no: string;

  @Column({ nullable: true })
  off_s_h_cd: string;

  @Column({ nullable: true })
  bal_name: string;

  @Column({ nullable: true })
  bal_num: string;

  @Column({ nullable: true })
  bal_juris: string;

  @Column({ nullable: true })
  supp_opp_cd: string;

  @Column()
  memo_code: boolean;

  @Column({ nullable: true })
  memo_refno: string;

  @Column({ nullable: true })
  bakref_tid: string;

  @Column({ nullable: true })
  g_from_e_f: string;

  @Column({ nullable: true })
  xref_schnm: string;

  @Column({ nullable: true })
  xref_match: string;

  // Added fields that are not in the XLSX file.
  @Column({ nullable: true })
  xlsx_file_year: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
