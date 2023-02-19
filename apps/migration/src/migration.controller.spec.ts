import { Test, TestingModule } from '@nestjs/testing';
import { MigrationController } from './migration.controller';
import { MigrationService } from './migration.service';

describe('MigrationController', () => {
  let migrationController: MigrationController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MigrationController],
      providers: [MigrationService],
    }).compile();

    migrationController = app.get<MigrationController>(MigrationController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(migrationController.getHello()).toBe('Hello World!');
    });
  });
});
