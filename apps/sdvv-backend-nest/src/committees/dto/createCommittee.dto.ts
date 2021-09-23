import { Matches, IsString } from 'class-validator';

export class CreateCommitteeDto {
  @IsString()
  entity_id: string;

  @IsString()
  entity_name: string;

  @IsString()
  entity_name_lower: string;

  @IsString()
  @Matches('committee', 'i')
  entity_type: string;
}
