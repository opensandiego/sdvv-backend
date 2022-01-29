import { IsNumberString } from 'class-validator';

export class ElectionYearParams {
  @IsNumberString()
  year: number;
}
