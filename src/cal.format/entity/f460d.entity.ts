import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'f460d' })
export class F460DEntity {
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

  @Column()
  elect_date: string;

  // From expn.dto
  @Column()
  rec_type: string;

  @PrimaryColumn()
  form_type: string;

  @PrimaryColumn()
  tran_id: string;

  @Column()
  entity_cd: string;

  @Column()
  payee_naml: string;

  @Column()
  payee_namf: string;

  @Column()
  payee_namt: string;

  @Column()
  payee_nams: string;

  @Column()
  payee_adr1: string;

  @Column()
  payee_adr2: string;

  @Column()
  payee_city: string;

  @Column()
  payee_st: string;

  @Column()
  payee_zip4: string;

  @Column()
  expn_date: string;

  @Column()
  amount: number;

  @Column()
  cum_ytd: number;

  @Column()
  expn_code: string;

  @Column()
  expn_dscr: string;

  @Column()
  agent_naml: string;

  @Column()
  agent_namf: string;

  @Column()
  agent_namt: string;

  @Column()
  agent_nams: string;

  @Column()
  cmte_id: string;

  @Column()
  tres_naml: string;

  @Column()
  tres_namf: string;

  @Column()
  tres_namt: string;

  @Column()
  tres_nams: string;

  @Column()
  tres_adr1: string;

  @Column()
  tres_adr2: string;

  @Column()
  tres_city: string;

  @Column()
  tres_st: string;

  @Column()
  tres_zip4: string;

  @Column()
  cand_naml: string;

  @Column()
  cand_namf: string;

  @Column()
  cand_namt: string;

  @Column()
  cand_nams: string;

  @Column()
  office_cd: string;

  @Column()
  office_dscr: string;

  @Column()
  juris_cd: string;

  @Column()
  juris_dscr: string;

  @Column()
  dist_no: string;

  @Column()
  off_s_h_cd: string;

  @Column()
  bal_name: string;

  @Column()
  bal_num: string;

  @Column()
  bal_juris: string;

  @Column()
  supp_opp_cd: string;

  @Column()
  memo_code: boolean;

  @Column()
  memo_refno: string;

  @Column()
  bakref_tid: string;

  @Column()
  g_from_e_f: string;

  @Column()
  xref_schnm: string;

  @Column()
  xref_match: string;

  // Added fields that are not in the XLSX file.
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
