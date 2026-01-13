import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { RCPTEntity } from '../tables-xlsx/rcpt/rcpt.entity';

@Injectable()
export class LastUpdateService {
  constructor(private dataSource: DataSource) {}

  async getLastUpdated(year: string): Promise<string> {
    const query = this.dataSource
      .getRepository(RCPTEntity)
      .createQueryBuilder()
      .select('updated_at', 'date')
      .andWhere('xlsx_file_year = :year', { year })
      .orderBy('date', 'DESC')
      .limit(1);

      const result = await query.getRawOne();
      return result?.date;
  }
}
