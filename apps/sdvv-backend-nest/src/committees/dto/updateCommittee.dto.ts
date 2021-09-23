import { PartialType } from '@nestjs/mapped-types';
import { CreateCommitteeDto } from './createCommittee.dto';

export class UpdateCommitteeDto extends PartialType(CreateCommitteeDto) {}
