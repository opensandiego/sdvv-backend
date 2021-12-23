import { IsArray, IsString } from 'class-validator';

export class CreateJurisdictionDto {
  @IsString()
  city: string;

  @IsString()
  type: string;

  @IsString()
  name: string;

  @IsArray()
  @IsString({
    each: true,
  })
  zipCodes: string[];
}
