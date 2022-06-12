import { IntersectionType } from '@nestjs/mapped-types';
import { CommonDto } from '@app/sdvv-database/shared/dto/common.dto';
import { S496Dto } from '@app/sdvv-database/shared/dto/s496.dto';

export class CreateS496Dto extends IntersectionType(CommonDto, S496Dto) {}
