import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types';
import { IsDefined, IsEmpty, IsNotEmpty, IsNumber } from 'class-validator';
import { CommonDto } from './common.dto';
import { EXPNDto } from './expn.dto';

class F460DContribIndepExpn {
  @IsDefined()
  cmtte_type: string;

  @IsDefined()
  filer_id: string;

  @IsDefined()
  filer_naml: string;

  @IsDefined()
  report_num: string;

  @IsDefined()
  e_filing_id: string;

  @IsDefined()
  rec_type: string;

  @IsDefined()
  tran_id: string;

  @IsDefined()
  amount: number;
}

export class CreateF460DContribIndepExpnDto extends IntersectionType(
  CommonDto,
  EXPNDto,
  F460DContribIndepExpn,
) {}
