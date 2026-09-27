import { IsString } from 'class-validator';

export class DistrictsSpendingQueryDto {
  @IsString()
  year!: string;
}
