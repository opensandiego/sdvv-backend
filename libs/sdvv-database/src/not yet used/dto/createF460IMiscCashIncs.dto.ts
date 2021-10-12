import { IntersectionType } from '@nestjs/mapped-types';
import { CommonDto } from './common.dto';
import { RCPTDto } from './rcpt.dto';

export class CreateF460IMiscCashIncsDto extends IntersectionType(
  CommonDto,
  RCPTDto,
) {}
