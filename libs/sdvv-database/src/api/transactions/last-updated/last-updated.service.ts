import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { RCPTEntity } from '@app/sdvv-database/tables-xlsx/rcpt/rcpt.entity';

@Injectable()
export class LastUpdatedDateService {
  constructor(private dataSource: DataSource) {}

  async getLastUpdatedDate({ electionYear }: { electionYear: number }) {
    const electionYears = [electionYear, electionYear - 1].map(String);

    const query = this.dataSource
      .getRepository(RCPTEntity)
      .createQueryBuilder()
      .select('updated_at', 'date')
      .where('xlsx_file_year = ANY(:years)', { years: electionYears })
      .orderBy('date', 'DESC')
      .limit(1);

    const result = await query.getRawOne<{ date: string }>();

    // Handle the case where no records are found
    if (!result) {
      throw new NotFoundException(
        `No update date found for election year ${electionYear} or ${electionYear - 1}`,
      );
    }

    return {
      date: result.date,
    };
  }
}
