import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 's496' })
export class S496Entity {
  @PrimaryGeneratedColumn()
  id: number;

  // From common.dto
  @Column({ nullable: true })
  filer_id: string;

  @Column() // From s496.dto
  rpt_id_num: string;

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

  // From s496.dto
  @Column()
  rec_type: string;

  @Column()
  form_type: string;

  @Column() // use this to check for duplicates
  tran_id: string;

  @Column('decimal')
  amount: number;

  @Column()
  exp_date: string;

  @Column({ nullable: true })
  date_thru: string;

  @Column()
  expn_dscr: string;

  @Column({ nullable: true })
  supp_opp_cd: string;

  @Column({ nullable: true })
  bal_name: string;

  @Column({ nullable: true })
  bal_num: string;

  @Column({ nullable: true })
  bal_juris: string;

  @Column()
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
  dist_no: string;

  @Column({ nullable: true })
  juris_cd: string;

  @Column({ nullable: true })
  juris_dscr: string;

  @Column({ nullable: true })
  memo_code: boolean;

  @Column({ nullable: true })
  memo_refno: string;

  // Added fields that are not in the XLSX file.
  @Column({ nullable: true })
  xlsx_file_year: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
