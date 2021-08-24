import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { Exclude, Expose, Transform } from 'class-transformer';

export class CreateTransactionDto {
  filer_name: string;

  doc_public: string;

  e_filing_id: string;

  @IsNotEmpty()
  tran_id: string;

  @IsNotEmpty()
  transaction_date: string;

  amount: string;

  tx_type: string;

  schedule: string;

  @IsUUID()
  @IsNotEmpty()
  filing_id: string;

  filing_type: string;

  name: string;

  intr_name: string;

  city: string;

  state: string;

  zip: string;

  spending_code: string;

  employer: string;

  occupation: string;

  // Fields below are not from eFile
  @Expose()
  get transaction_date_time() {
    return new Date(this.transaction_date).toISOString();
  }
}
