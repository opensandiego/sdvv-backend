import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { Exclude, Expose, Transform } from 'class-transformer';

const dateOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
} as const;

export class CreateFilingDto {
  @IsUUID()
  @IsNotEmpty()
  filing_id: string;

  filing_type: string;

  e_filing_id: string;

  @Transform(
    ({ value }) =>
      new Date(value + ' PDT').toLocaleDateString('en-US', dateOptions),
    { toClassOnly: true },
  )
  filing_date: string;

  @Expose()
  get filing_date_time() {
    return new Date(this.filing_date).toISOString();
  }

  @IsOptional()
  @Transform(
    ({ value }) =>
      value
        ? new Date(value + ' PDT').toLocaleDateString('en-US', dateOptions)
        : value,
    { toClassOnly: true },
  )
  period_end: string;

  @IsBoolean()
  amendment: boolean;

  @IsInt()
  amendment_number: number;

  @Transform(({ value }) => (value?.orig_id ? value.orig_id : value), {
    toClassOnly: true,
  })
  amends_orig_id: string;

  @Transform(({ value }) => (value?.prev_id ? value.prev_id : value), {
    toClassOnly: true,
  })
  amends_prev_id: string;

  filing_subtypes: string | null;

  entity_name: string;

  doc_public: string;

  // By Name
  @Exclude()
  period_start: string;
  @Exclude()
  amendment_type: string | number;
  @Exclude()
  covers_period: string;
  @Exclude()
  form: string;
  @Exclude()

  // ByElection
  coe_id: string;
  @Exclude()
  entity_id: string;
  @Exclude()
  name: string;
  @Exclude()
  name_first: string;
  @Exclude()
  name_title: string;
  @Exclude()
  name_suffix: string;
  @Exclude()
  form_name: string;
}
