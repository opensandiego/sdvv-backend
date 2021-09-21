import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';

export class S497Dto {
  @IsString()
  @MaxLength(4)
  rec_type: string;

  @IsString()
  @MaxLength(6)
  form_type: string;

  @IsString()
  @MaxLength(20)
  tran_id: string;

  @IsString()
  @MaxLength(3)
  entity_cd: string;

  @IsString()
  @MaxLength(200)
  enty_naml: string;

  @IsString()
  @MaxLength(45)
  enty_namf: string;

  @IsString()
  @MaxLength(10)
  enty_namt: string;

  @IsString()
  @MaxLength(10)
  enty_nams: string;

  @IsString()
  @MaxLength(55)
  enty_adr1: string;

  @IsString()
  @MaxLength(55)
  enty_adr2: string;

  @IsString()
  @MaxLength(30)
  enty_city: string;

  @IsString()
  @MaxLength(2)
  enty_st: string;

  @IsString()
  @MaxLength(10)
  enty_zip4: string;

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
  @Length(8, 8)
  @IsNumberString()
  elec_date: string;

  @IsString()
  @Length(8, 8)
  @IsNumberString()
  ctrib_date: string;

  @IsNotEmpty()
  @Length(8, 8)
  @IsNumberString()
  date_thru: string;

  @Type(() => Number)
  @IsNumber()
  amount: number;

  @IsString()
  @MaxLength(9)
  cmte_id: string;

  @IsString()
  @MaxLength(200)
  cand_naml: string;

  @IsString()
  @MaxLength(45)
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
  @MaxLength(40)
  juris_dscr: string;

  @IsString()
  @MaxLength(3)
  @IsNumberString()
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
  @MaxLength(1)
  memo_code: string;

  @IsString()
  @MaxLength(20)
  memo_refno: string;
}
