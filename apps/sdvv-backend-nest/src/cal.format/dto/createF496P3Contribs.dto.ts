import { IntersectionType } from '@nestjs/mapped-types';
import { CommonDto } from './common.dto';
import { RCPTDto } from './rcpt.dto';

export class CreateF496P3ContribsDto extends IntersectionType(
  CommonDto,
  RCPTDto,
) {}
