import { Matches, IsEnum, IsBoolean, IsUUID } from 'class-validator';

export class CreateElectionDto {
  @Matches(/^\d{2}\/\d{2}\/\d{4}$/)
  election_date: string;

  @IsUUID()
  election_id: string;

  @IsEnum(['Primary', 'General', 'Special', 'Runoff'])
  election_type: string;

  @IsBoolean()
  internal: boolean;
}
