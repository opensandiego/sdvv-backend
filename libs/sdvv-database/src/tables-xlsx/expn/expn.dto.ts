import { IntersectionType } from '@nestjs/mapped-types';
import { CommonDto } from '@app/sdvv-database/shared/dto/common.dto';
import { EXPNDto } from '@app/sdvv-database/shared/dto/expn.dto';

export class CreateEXPNDto extends IntersectionType(CommonDto, EXPNDto) {}
