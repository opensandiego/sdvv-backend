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

  @IsNotEmpty()
  @Length(8, 8)
  @IsNumberString()
  date_thru: string;

  @IsString()
  @MaxLength(90)
  expn_dscr: string;

  @IsString()
  @MaxLength(1)
  memo_code: string;

  @IsString()
  @MaxLength(20)
  memo_refno: string;
}
