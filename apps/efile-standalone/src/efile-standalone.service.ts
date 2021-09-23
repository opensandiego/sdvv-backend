import { Injectable } from '@nestjs/common';

@Injectable()
export class EfileStandaloneService {
  getHello(): string {
    return 'Hello World!';
  }
}
