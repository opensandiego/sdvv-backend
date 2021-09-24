import { IntersectionType } from '@nestjs/mapped-types';
import { IsDefined } from 'class-validator';
import { CommonDto } from '../../shared-dto/common.dto';
import { EXPNDto } from '../../shared-dto/expn.dto';

export class CreateF460DContribIndepExpnDto extends IntersectionType(
  CommonDto,
  EXPNDto,
) {
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
