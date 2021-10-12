import { IsString } from 'class-validator';

export class CreateZipCodeDto {
  @IsString()
  zip: string;

  @IsString()
  type: string;

  @IsString()
  decommissioned: string;

  @IsString()
  primary_city: string;

  @IsString()
  acceptable_cities: string;

  @IsString()
  unacceptable_cities: string;

  @IsString()
  state: string;

  @IsString()
  county: string;

  @IsString()
  timezone: string;

  @IsString()
  area_codes: string;

  @IsString()
  world_region: string;

  @IsString()
  country: string;

  @IsString()
  latitude: string;

  @IsString()
  longitude: string;

  @IsString()
  irs_estimated_population_2015: string;
}
