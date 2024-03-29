import { IntersectionType } from '@nestjs/mapped-types';
import { CommonDto } from './common.dto';
import { EXPNDto } from './expn.dto';

export class CreateF460EExpendituresDto extends IntersectionType(
  CommonDto,
  EXPNDto,
) {}
