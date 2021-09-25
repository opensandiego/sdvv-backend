import { Processor, Process } from '@nestjs/bull';
import { ZipCodeCSVService } from './zip.code.csv.service';

@Processor('zip-csv-tasks')
export class ZipCodeCSVProcessor {
  constructor(private zipCodeCSVService: ZipCodeCSVService) {}

  @Process()
  async action() {
    await this.zipCodeCSVService.populateDatabaseWithZipCodes();
  }
}
