import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { FilingEntity } from '../filings/filings.entity';
import { TransactionEntity } from '../transactions/transactions.entity';

@Injectable()
export class ProcessFilingService {
  constructor(private connection: Connection) {}

  async processFilings(filingID?: string) {
    const filingOrigIDs: string[] = await this.getFilingIDs(filingID);

    for await (const filingOrigID of filingOrigIDs) {
      await this.processTransactionsByFilingOrigId(filingOrigID);
    }
  }

  async getFilingIDs(filingID?: string): Promise<string[]> {
    try {
      if (filingID) {
        return await this.getOrigIDFromFilingId(filingID);
      } else {
        return await this.getOrigIDsFromAllFilings();
      }
    } catch (error) {
      console.log(
        'Error in getFilingIDs, filing does not exist or is not enabled',
      );
      throw error;
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

  private async getOrigIDFromFilingId(filingID: string): Promise<string[]> {
    const filingRepository = this.connection.getRepository(FilingEntity);
    const filing = await filingRepository.findOne({
      where: {
        enabled: true,
        filing_id: filingID,
      },
    });

    return [filing.amends_orig_id];
  }

  async processTransactionsByFilingOrigId(filingOrigID: string): Promise<void> {
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
