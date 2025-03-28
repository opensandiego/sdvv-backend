import { Matches, IsBoolean, IsIn, IsString } from 'class-validator';

export class CreateElectionDto {
  @Matches(/^\d{2}\/\d{2}\/\d{4}$/)
  election_date: string;

  @IsString() // Was IsUUID
  election_id: string;

  @IsIn(['Primary', 'General', 'Special', 'Runoff'] as const)
  election_type: string;

  @IsBoolean()
  internal: boolean;
}
