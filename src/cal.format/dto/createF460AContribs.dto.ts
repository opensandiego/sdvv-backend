import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';
// import * as currency from 'currency.js';

export class CreateF460AContribsDto {
  @IsNotEmpty()
  @IsString()
  filer_id: string;

  @IsString()
  @MaxLength(200)
  filer_naml: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 3)
  report_num: string;

  @IsNotEmpty()
  @IsString()
  e_filing_id: string;

  @IsNotEmpty()
  @IsString()
  orig_e_filing_id: string;

  // @IsNotEmpty()
  @Length(1, 1)
  @IsString()
  @IsIn(['C', 'P', 'B', 'G'])
  cmtte_type: string;
  // (Req on F450 & F460)

  // // @IsNotEmpty()
  // @Length(8, 8)
  // @IsNumber()
  // rpt_date: number;

  // // @IsNotEmpty()
  // @Length(8, 8)
  // @IsNumber()
  // from_date: number;

  // // @IsNotEmpty()
  // @Length(8, 8)
  // @IsNumber()
  // thru_date: number;

  // @IsOptional()
  // @Length(8, 8)
  // @IsNumber()
  // elect_date: number;

  // @IsString()
  // @MaxLength(4)
  // rec_type: string;

  // @IsString()
  // @MaxLength(8)
  // form_type: string;

  // @IsString()
  // @MaxLength(20)
  // tran_id: string;

  // @IsString()
  // @MaxLength(3)
  // entity_cd: string;

  // @IsString()
  // @MaxLength(200)
  // ctrib_naml: string;

  // @IsString()
  // @MaxLength(45)
  // ctrib_namf: string;

  // @IsString()
  // @MaxLength(10)
  // ctrib_namt: string;

  // @IsString()
  // @MaxLength(10)
  // ctrib_nams: string;

  // @IsString()
  // @MaxLength(55)
  // ctrib_adr1: string;

  // @IsString()
  // @MaxLength(55)
  // ctrib_adr2: string;

  // @IsString()
  // @MaxLength(30)
  // ctrib_city: string;

  // @IsString()
  // @MaxLength(2)
  // ctrib_st: string;

  // @IsString()
  // @MaxLength(10)
  // ctrib_zip4: string;

  // @IsString()
  // @MaxLength(200)
  // ctrib_emp: string;

  // @IsString()
  // @MaxLength(60)
  // ctrib_occ: string;

  // @IsString()
  // @MaxLength(1)
  // ctrib_self: string;

  // @IsString()
  // @MaxLength(1)
  // tran_type: string;

  // @IsNotEmpty()
  // @Length(8, 8)
  // @IsNumber()
  // rcpt_date: number;

  // @IsOptional()
  // @Length(8, 8)
  // @IsNumber()
  // date_thru: number;

  @Type(() => Number)
  @IsNumber()
  amount: number;

  // @IsNumber()
  // @MaxLength(12)
  // cum_ytd: number;

  // @IsString()
  // @MaxLength(90)
  // ctrib_dscr: string;

  // @IsOptional()
  // @MaxLength(9)
  // cmte_id: string;


  // tres_naml: string;
  // tres_namf: string;
  // tres_namt: string;
  // tres_nams: string;
  // tres_adr1: string;
  // tres_adr2: string;
  // tres_city: string;
  // tres_st: string;
  // tres_zip4: string;
  // intr_naml: string;
  // intr_namf: string;
  // intr_namt: string;
  // intr_nams: string;
  // intr_adr1: string;
  // intr_adr2: string;
  // intr_city: string;
  // intr_st: string;
  // intr_zip4: string;
  // intr_emp: string;
  // intr_occ: string;
  // intr_self: string;

  // @MaxLength(1)
  // memo_code: string;

  // @MaxLength(20)
  // memo_refno: string;

  // @MaxLength(20)
  // bakref_tid: string;

  // @MaxLength(2)
  // xref_schnm

  // @MaxLength(1)
  // xref_match

  // @MaxLength(9)
  // int_rate

  // @MaxLength(9)
  // int_cmteid
}
