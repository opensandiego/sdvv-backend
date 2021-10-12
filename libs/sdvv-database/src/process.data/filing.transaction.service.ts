import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { FilingEntity } from '@app/efile-api-data/tables/entity/filings.entity';
import { TransactionEntity } from '@app/efile-api-data/tables/entity/transactions.entity';

@Injectable()
export class FilingTransactionService {
  constructor(private connection: Connection) {}

  async processAllFilings() {
    console.log('filings-process-all: started');
    try {
      await this.processFilings();
    } catch (error) {
      console.log('Error in filings-process-all');
    }

    console.log('filings-process-all: completed');
    return {};
  }

  private async processFilings() {
    const filingOrigIDs: string[] = await this.getOrigIDsFromAllFilings();

    for await (const filingOrigID of filingOrigIDs) {
      await this.processTransactionsByFilingOrigId(filingOrigID);
    }
  }

  // All transactions including those with "amendment_number: 0" should have an amends_orig_id with a valid id
  //  Those with "amendment_number: 0" have amends_orig_id === filing_id after amends_orig_id is set in the database
  private async getOrigIDsFromAllFilings(): Promise<string[]> {
    const filingRepository = this.connection.getRepository(FilingEntity);
    const filings = await filingRepository.find({
      where: {
        enabled: true,
      },
    });
    const amendsOrigIDs = filings.map((filing) => filing.amends_orig_id);
    const uniqueOrigIds = [...new Set(amendsOrigIDs)];
    return uniqueOrigIds;
  }

  private async processTransactionsByFilingOrigId(
    filingOrigID: string,
  ): Promise<void> {
    const filingRepository = this.connection.getRepository(FilingEntity);
    const filings = await filingRepository.find({
      where: [{ enabled: true, amends_orig_id: filingOrigID }],
    });

    const amendmentNumbers: number[] = filings.map(
      (filing) => filing.amendment_number,
    );
    const maxAmendmentNumber: number = Math.max(...amendmentNumbers);

    for await (const filing of filings) {
      await this.connection
        .createQueryBuilder()
        .update(TransactionEntity)
        .set({
          has_been_processed: true,
          include_in_calculations:
            filing.amendment_number === maxAmendmentNumber,
        })
        .where('filing_id = :filingID', { filingID: filing.filing_id })
        .execute();
    }
  }
}
