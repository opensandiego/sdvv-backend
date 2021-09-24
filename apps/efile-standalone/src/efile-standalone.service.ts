import { F460DService } from '@app/cal-data/f460d/f460d.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EFileStandaloneService {
  constructor(private f460DService: F460DService) {}

  async getHello(): Promise<string> {
    await this.f460DService.findAll();
    return 'Hello World!';
  }
}
