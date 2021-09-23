import { IsNotEmpty } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import * as currency from 'currency.js';

export class CreateTransactionDto {
  filer_name: string;

  doc_public: string;

  e_filing_id: string;

  @IsNotEmpty()
  tran_id: string;

  @IsNotEmpty()
  transaction_date: string;

  // Convert the string from eFile to a number. Example: "$101" -> 101
  @Transform(({ value }) => currency(value).value, {
    toClassOnly: true,
  })
  amount: number;

  tx_type: string;

  schedule: string;

  @IsNotEmpty()
  filing_id: string;

  filing_type: string;

  name: string;

  intr_name: string;

  city: string;

  state: string;

  zip: string;

  spending_code: string | null;

  employer: string;

  occupation: string;

  // Fields below are not from eFile
  @Expose()
  get transaction_date_time() {
    return new Date(this.transaction_date).toISOString();
  }
}
