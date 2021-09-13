import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

@Injectable()
export class CalculateChartDataService {
  constructor(private connection: Connection) {}
}
