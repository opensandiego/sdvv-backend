import { IntersectionType, PickType } from '@nestjs/mapped-types';
import { CommonDto } from './common.dto';
import { EXPNDto } from './expn.dto';

class CombinedF460D extends IntersectionType(CommonDto, EXPNDto) {}

const requiredFields = [
  'filer_id',
  'filer_naml',
  'report_num',
  'e_filing_id',
  'cmtte_type',
  'rec_type',
  'amount',
] as const;

export class CreateF460DContribIndepExpnDto extends PickType(
  CombinedF460D,
  requiredFields,
) {}
