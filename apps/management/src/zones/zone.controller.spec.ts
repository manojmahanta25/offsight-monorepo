import { Test, TestingModule } from '@nestjs/testing';
import { ZoneController } from './zone.controller';
import { ZoneModule } from './zone.module';
import { ZoneService } from "./zone.service";

describe('ZoneController', () => {
  let controller: ZoneController;
  let service: ZoneService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[ZoneModule],
      controllers: [ZoneController],
      providers:[ZoneService]
    }).compile();

    controller = module.get<ZoneController>(ZoneController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
