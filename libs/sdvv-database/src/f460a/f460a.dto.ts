import { IntersectionType } from '@nestjs/mapped-types';
import { CommonDto } from '@app/sdvv-database/shared/dto/common.dto';
import { RCPTDto } from '@app/sdvv-database/shared/dto/rcpt.dto';

export class CreateF460ADto extends IntersectionType(CommonDto, RCPTDto) {}
