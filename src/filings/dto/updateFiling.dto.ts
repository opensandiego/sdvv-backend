import { PartialType } from '@nestjs/mapped-types';
import { CreateFilingDto } from './createFiling.dto';

export class UpdateCaFilingDto extends PartialType(CreateFilingDto) {}
