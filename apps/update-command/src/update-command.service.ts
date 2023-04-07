import { Injectable } from '@nestjs/common';

@Injectable()
export class UpdateCommandService {
  getHello(): string {
    return 'Hello World!';
  }
}
