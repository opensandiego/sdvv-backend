import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { FilingEntity } from '@app/efile-api-data/tables/entity/filings.entity';
import { TransactionEntity } from '@app/efile-api-data/tables/entity/transactions.entity';

@Injectable()
export class FilingTransactionService {
  constructor(private connection: Connection) {}

}
