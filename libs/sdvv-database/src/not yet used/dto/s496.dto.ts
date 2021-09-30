import {
  IsBoolean,
  IsNumber,
  IsNumberString,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class S496Dto {
  @IsString()
  @MaxLength(4)
  rec_type: string;

  @IsString()
  @MaxLength(4)
  form_type: string;

  @IsString()
  @MaxLength(20)
  tran_id: string;

  @Type(() => Number)
  @IsNumber()
  amount: number;

  @IsString()
  @Length(8, 8)
  @IsNumberString()
  expn_date: string;

  @Length(8, 8)
  @IsNumberString()
  date_thru: string;

  @IsString()
  @MaxLength(90)
  expn_dscr: string;

  @Type(() => Boolean)
  @IsBoolean()
  memo_code: string;

  @IsString()
  @MaxLength(20)
  memo_refno: string;
}
