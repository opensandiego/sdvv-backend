import {
  IsBoolean,
  IsNumber,
  IsNumberString,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class S496Dto {
  @IsString()
  rpt_id_num: string;

  @IsString()
  rec_type: string;

  @IsString()
  form_type: string;

  @IsString()
  tran_id: string;

  @Type(() => Number)
  @IsNumber()
  amount: number;

  @IsString()
  @Length(8, 8)
  @IsNumberString()
  exp_date: string;

  @Length(8, 8)
  @IsNumberString()
  date_thru: string;

  @IsString()
  @MaxLength(90)
  expn_dscr: string;

  @IsString()
  supp_opp_cd: string;

  @IsString()
  bal_name: string;

  @IsString()
  bal_num: string;

  @IsString()
  bal_juris: string;

  @IsString()
  @Transform(({ value }) =>
    value ? value.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : '',
  )
  cand_naml: string;

  @IsString()
  @Transform(({ value }) =>
    value ? value.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : '',
  )
  cand_namf: string;

  @IsString()
  cand_namt: string;

  @IsString()
  cand_nams: string;

  @IsString()
  office_cd: string;

  @IsString()
  office_dscr: string;

  @IsString()
  dist_no: string;

  @IsString()
  juris_cd: string;

  @IsString()
  juris_dscr: string;

  @Type(() => Boolean)
  @IsBoolean()
  memo_code: boolean;

  @IsString()
  @MaxLength(20)
  memo_refno: string;
}
