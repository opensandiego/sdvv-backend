import { IsNumberString, IsOptional, Length } from 'class-validator';

export class LastUpdateYearParams {
  @IsOptional()
  @IsNumberString()
  @Length(4, 4)
  year: string;
}
