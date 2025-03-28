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
import { S497Dto } from './s497.dto';

class OptionalDetails {
  @IsOptional()
  from_date: string;

  @IsOptional()
  thru_date: string;
}

export class CreateS497DTO extends IntersectionType(
  CommonDto,
  S497Dto,
  OptionalDetails,
) {
  @IsString()
  rpt_id_num: string;
}
