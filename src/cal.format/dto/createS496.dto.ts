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
import { CommonDto } from './common.dto';
import { IntersectionType } from '@nestjs/mapped-types';
import { S496Dto } from './s496.dto';

export class CreateS496DTO extends IntersectionType(CommonDto, S496Dto) {
  @IsOptional()
  from_date: string;

  @IsOptional()
  thru_date: string;

  @IsString()
  rpt_id_num: string;

  @IsString()
  supp_opp_cd: string;

  @IsString()
  bal_name: string;

  @IsString()
  bal_num: string;

  @IsString()
  bal_juris: string;

  @IsString()
  cand_naml: string;

  @IsString()
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
  @IsNumberString()
  dist_no: string;

  @IsString()
  juris_cd: string;

  @IsString()
  juris_dscr: string;
}
