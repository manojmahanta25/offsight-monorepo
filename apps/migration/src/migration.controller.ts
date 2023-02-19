import { Controller, Get } from '@nestjs/common';
import { MigrationService } from './migration.service';

@Controller()
export class MigrationController {
  constructor(private readonly migrationService: MigrationService) {}

  @Get()
  getHello(): string {
    return this.migrationService.getHello();
  }
}
