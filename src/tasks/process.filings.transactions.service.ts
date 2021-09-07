import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilingEntity } from './../filings/filings.entity';
import { TransactionEntity } from './../transactions/transactions.entity';

@Injectable()
export class FilingsService {
  constructor(
    // @InjectRepository(FilingEntity)
    // private filingRepository: Repository<FilingEntity>,
    // @InjectRepository(TransactionEntity)
    // private transactionRepository: Repository<TransactionEntity>,
  ) {}

  processFilings(ids: string[]) {}

  async processFiling(id: string) {
    // // get Original ID
    // const filing = await this.filingRepository.findOne(id);

    // const relatedFilings = await this.filingRepository.find({
    //   amends_orig_id: filing.amends_orig_id,
    //   enabled: true,
    // });

    // const amendmentNumbers: number[] = relatedFilings.map(
    //   (filing) => filing.amendment_number,
    // );
    // const maxAmendmentNumber: number = Math.max(...amendmentNumbers);

    // for (const filing of relatedFilings) {
    //   await this.transactionRepository.find({
    //     filing_id: filing.filing_id,
    //   });
    // }
  }

  processTransactionsByFilingOrigId() {}
}
