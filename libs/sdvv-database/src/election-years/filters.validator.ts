import { IsBoolean, IsOptional } from 'class-validator';

export class FilterParams {
  @IsOptional()
  @IsBoolean()
  inPrimaryElection?: boolean;

  @IsOptional()
  @IsBoolean()
  inGeneralElection?: boolean;
}
