import { IsISO8601 } from 'class-validator';

export class DateRangeDto {
  @IsISO8601()
  oldestDate: string;

  @IsISO8601()
  newestDate: string;
}
