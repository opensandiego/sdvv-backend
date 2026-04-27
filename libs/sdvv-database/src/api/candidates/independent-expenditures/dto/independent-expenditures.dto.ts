import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CandidatesIndependentExpendituresDto {
  @IsString()
  @IsOptional()
  year?: string;

  @IsString()
  @IsOptional()
  office?: string;

  @IsString()
  @IsOptional()
  district?: string;
}
