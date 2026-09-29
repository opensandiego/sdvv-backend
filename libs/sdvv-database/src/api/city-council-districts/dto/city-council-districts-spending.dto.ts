import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CityCouncilDistrictsSpendingQueryDto {
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  electionYear!: number;
}
