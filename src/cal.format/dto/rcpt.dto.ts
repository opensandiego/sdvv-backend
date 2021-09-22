import {
  IsNumber,
  IsNumberString,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RCPTDto {
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
  ctrib_naml: string;

  @IsString()
  @MaxLength(45)
  ctrib_namf: string;

  @IsString()
  @MaxLength(10)
  ctrib_namt: string;

  @IsString()
  @MaxLength(10)
  ctrib_nams: string;

  @IsString()
  @MaxLength(55)
  ctrib_adr1: string;

  @IsString()
  @MaxLength(55)
  ctrib_adr2: string;

  @IsString()
  @MaxLength(30)
  ctrib_city: string;

  @IsString()
  @MaxLength(2)
  ctrib_st: string;

  @IsString()
  @MaxLength(10)
  ctrib_zip4: string;

  @IsString()
  @MaxLength(200)
  ctrib_emp: string;

  @IsString()
  @MaxLength(60)
  ctrib_occ: string;

  @IsString()
  @MaxLength(1)
  ctrib_self: string;

  @IsString()
  @MaxLength(1)
  tran_type: string;

  @IsString()
  @Length(8, 8)
  @IsNumberString()
  rcpt_date: string;

  @IsString()
  @Length(8, 8)
  @IsNumberString()
  date_thru: string;

  @Type(() => Number)
  @IsNumber()
  amount: number;

  @Type(() => Number)
  @IsNumber()
  cum_ytd: number;

  @IsString()
  @MaxLength(90)
  ctrib_dscr: string;

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
  intr_naml: string;

  @IsString()
  @MaxLength(45)
  intr_namf: string;

  @IsString()
  @MaxLength(10)
  intr_namt: string;

  @IsString()
  @MaxLength(10)
  intr_nams: string;

  @IsString()
  @MaxLength(55)
  intr_adr1: string;

  @IsString()
  @MaxLength(55)
  intr_adr2: string;

  @IsString()
  @MaxLength(30)
  intr_city: string;

  @IsString()
  @MaxLength(2)
  intr_st: string;

  @IsString()
  @MaxLength(10)
  intr_zip4: string;

  @IsString()
  @MaxLength(200)
  intr_emp: string;

  @IsString()
  @MaxLength(60)
  intr_occ: string;

  @IsString()
  @MaxLength(1)
  intr_self: string;

  @IsString()
  @MaxLength(1)
  memo_code: string;

  @IsString()
  @MaxLength(20)
  memo_refno: string;

  @IsString()
  @MaxLength(20)
  bakref_tid: string;

  @IsString()
  @MaxLength(2)
  xref_schnm: string;

  @IsString()
  @MaxLength(1)
  xref_match: string;

  @IsString()
  @MaxLength(6)
  int_rate: string;

  @IsString()
  @MaxLength(9)
  int_cmteid: string;
}
