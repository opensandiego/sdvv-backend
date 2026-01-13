import {
  IsBoolean,
  IsNumber,
  IsNumberString,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class EXPNDto {
  @IsString()
  @MaxLength(4)
  rec_type: string;

  @IsString()
  @MaxLength(8)
  form_type: string;

  @IsString()
  @MaxLength(20)
  tran_id: string;

  @IsString()
  @MaxLength(3)
  entity_cd: string;

  @IsString()
  @MaxLength(200)
  @Transform(({ value }) =>
    value ? value.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : '',
  )
  payee_naml: string;

  @IsString()
  @MaxLength(45)
  @Transform(({ value }) =>
    value ? value.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : '',
  )
  payee_namf: string;

  @IsString()
  @MaxLength(10)
  payee_namt: string;

  @IsString()
  @MaxLength(10)
  payee_nams: string;

  @IsString()
  @MaxLength(55)
  payee_adr1: string;

  @IsString()
  @MaxLength(55)
  payee_adr2: string;

  @IsString()
  @MaxLength(30)
  payee_city: string;

  @IsString()
  @MaxLength(2)
  payee_st: string;

  @IsString()
  @MaxLength(10)
  payee_zip4: string;

  @IsString()
  @Length(8, 8)
  @IsNumberString()
  expn_date: string;

  @Type(() => Number)
  @IsNumber()
  amount: number;

  @Type(() => Number)
  @IsNumber()
  cum_ytd: number;

  @IsString()
  @MaxLength(3)
  expn_code: string;

  @IsString()
  @MaxLength(400)
  expn_dscr: string;

  @IsString()
  @MaxLength(200)
  agent_naml: string;

  @IsString()
  @MaxLength(45)
  agent_namf: string;

  @IsString()
  @MaxLength(10)
  agent_namt: string;

  @IsString()
  @MaxLength(10)
  agent_nams: string;

  @IsString()
  @MaxLength(9)
  cmte_id: string;

  @IsString()
  @MaxLength(200)
  tres_naml: string;

  @IsString()
  @MaxLength(45)
  tres_namf: string;

  @IsString()
  @MaxLength(10)
  tres_namt: string;

  @IsString()
  @MaxLength(10)
  tres_nams: string;

  @IsString()
  @MaxLength(55)
  tres_adr1: string;

  @IsString()
  @MaxLength(55)
  tres_adr2: string;

  @IsString()
  @MaxLength(30)
  tres_city: string;

  @IsString()
  @MaxLength(2)
  tres_st: string;

  @IsString()
  @MaxLength(10)
  tres_zip4: string;

  @IsString()
  @MaxLength(200)
  @Transform(({ value }) =>
    value ? value.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : '',
  )
  cand_naml: string;

  @IsString()
  @MaxLength(45)
  @Transform(({ value }) =>
    value ? value.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : '',
  )
  cand_namf: string;

  @IsString()
  @MaxLength(10)
  cand_namt: string;

  @IsString()
  @MaxLength(10)
  cand_nams: string;

  @IsString()
  @MaxLength(3)
  office_cd: string;

  @IsString()
  @MaxLength(40)
  office_dscr: string;

  @IsString()
  @MaxLength(3)
  juris_cd: string;

  @IsString()
  @MaxLength(80)
  juris_dscr: string;

  @IsString()
  @MaxLength(3)
  dist_no: string;

  @IsString()
  @MaxLength(1)
  off_s_h_cd: string;

  @IsString()
  @MaxLength(200)
  bal_name: string;

  @IsString()
  @MaxLength(7)
  bal_num: string;

  @IsString()
  @MaxLength(40)
  bal_juris: string;

  @IsString()
  // @MaxLength(1)
  supp_opp_cd: string;

  @Type(() => Boolean)
  @IsBoolean()
  memo_code: boolean;

  @IsString()
  @MaxLength(20)
  memo_refno: string;

  @IsString()
  @MaxLength(20)
  bakref_tid: string;

  @IsString()
  @MaxLength(1)
  g_from_e_f: string;

  @IsString()
  @MaxLength(2)
  xref_schnm: string;

  @IsString()
  @MaxLength(1)
  xref_match: string;
}
