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

export class CommonDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(7)
  @IsNumberString()
  filer_id: string;

  @IsString()
  @MaxLength(200)
  filer_naml: string;

  // @IsNotEmpty()
  @IsString()
  @Length(3, 3)
  @IsNumberString()
  report_num: string;

  @IsNotEmpty()
  @IsString()
  @IsNumberString()
  e_filing_id: string;

  @IsNotEmpty()
  @IsString()
  @IsNumberString()
  orig_e_filing_id: string;

  // @IsNotEmpty()
  @IsString()
  @Length(1, 1)
  @IsIn(['C', 'P', 'B', 'G'])
  cmtte_type: string;
  // (Req on F450 & F460)

  @IsNotEmpty()
  @Length(8, 8)
  @IsNumberString()
  rpt_date: string;

  @IsNotEmpty()
  @Length(8, 8)
  @IsNumberString()
  from_date: string;

  @IsNotEmpty()
  @Length(8, 8)
  @IsNumberString()
  thru_date: string;

  @IsOptional()
  @Length(8, 8)
  @IsNumberString()
  elect_date: string;
}
