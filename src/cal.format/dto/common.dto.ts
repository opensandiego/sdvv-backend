import {
  IsIn,
  IsNumberString,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class CommonDto {
  @IsString()
  @MaxLength(7)
  @IsNumberString()
  filer_id: string;

  @IsString()
  @MaxLength(200)
  filer_naml: string;

  @IsString()
  @Length(3, 3)
  @IsNumberString()
  report_num: string;

  @IsString()
  @IsNumberString()
  e_filing_id: string;

  @IsString()
  @IsNumberString()
  orig_e_filing_id: string;

  @IsString()
  @Length(1, 1)
  @IsIn(['C', 'P', 'B', 'G'])
  cmtte_type: string;
  // (Req on F450 & F460)

  @Length(8, 8)
  @IsNumberString()
  rpt_date: string;

  @Length(8, 8)
  @IsNumberString()
  from_date: string;

  @Length(8, 8)
  @IsNumberString()
  thru_date: string;

  @Length(8, 8)
  @IsNumberString()
  elect_date: string;
}
