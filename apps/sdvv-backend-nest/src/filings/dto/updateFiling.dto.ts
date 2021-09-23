import { PartialType } from '@nestjs/mapped-types';
import { CreateFilingDto } from './createFiling.dto';

export class UpdateFilingDto extends PartialType(CreateFilingDto) {}
