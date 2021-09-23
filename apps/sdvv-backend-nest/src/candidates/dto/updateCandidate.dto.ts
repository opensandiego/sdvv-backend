import { PartialType } from '@nestjs/mapped-types';
import { CreateCandidateDto } from './createCandidate.dto';

export class UpdateCandidateDto extends PartialType(CreateCandidateDto) {}
