import { IntersectionType } from '@nestjs/mapped-types';
import { CommonDto } from './common.dto';
import { RCPTDto } from './rcpt.dto';
// import { CommonDto } from './common.dto';
// import { RCPTDto } from './rcpt.dto';

export class CreateF460CContribsDto extends IntersectionType(
  CommonDto,
  RCPTDto,
) {}
