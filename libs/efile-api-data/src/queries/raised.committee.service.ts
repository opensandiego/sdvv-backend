import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { RCPTEntity } from '@app/sdvv-database/tables-xlsx/rcpt/rcpt.entity';

@Injectable()
export class RaisedCommitteeService {
  constructor(private connection: Connection) {}

  // private RCPTTypes = ['A', 'C', 'I', 'F496P3'];
  private RCPTTypes = ['A', 'C', 'I'];

  async getRaisedByCommittee(committeeName: string) {
    return this.getRaisedByCommittees([committeeName]);
  }

  async getRaisedByCommittees(committeeNames?: string[]) {
    const result = await this.connection
      .getRepository(RCPTEntity)
      .createQueryBuilder()
      .select('SUM(amount)', 'sum')
      .where('filer_naml IN (:...committeeNames)', {
        committeeNames,
      })
      .andWhere('rec_type = :recType', { recType: 'RCPT' })
      .andWhere('form_type IN (:...formType)', { formType: this.RCPTTypes })
      .getRawOne();

    return result['sum'];
  }
}
