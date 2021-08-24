import { IsUUID } from 'class-validator';

export class CreateCandidateDto {
  @IsUUID()
  coe_id: string;

  @IsUUID()
  filer_id: string;

  @IsUUID()
  office_id: string;

  @IsUUID()
  election_id: string;

  first_name: string;

  middle_name: string;

  last_name: string;

  title: string;

  suffix: string;

  office: string;

  office_code: string;

  @IsUUID()
  jurisdiction_id: string;

  district: string;

  agency: string;

  jurisdiction_type: string;

  jurisdiction_name: string;

  jurisdiction_code: string;

  candidate_name: string;
}
