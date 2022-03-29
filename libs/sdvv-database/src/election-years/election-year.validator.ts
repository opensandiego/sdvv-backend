import { IsNumberString, IsOptional, ValidateNested } from 'class-validator';
import { FilterParams } from './filters.validator';

export class ElectionYearParams {
  @IsNumberString()
  year: number;

  @IsOptional()
  @ValidateNested()
  filters?: FilterParams;
}
