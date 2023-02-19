import { Injectable } from '@nestjs/common';

@Injectable()
export class MigrationService {
  getHello(): string {
    return 'Hello World!';
  }
}
