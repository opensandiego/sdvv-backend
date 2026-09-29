import { IsNotEmpty, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class LastUpdatedDateQueryDto {
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  electionYear!: number;
}
