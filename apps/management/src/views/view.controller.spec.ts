import { Test, TestingModule } from '@nestjs/testing';
import { ShareModule } from '../shared.modules';
import { ViewController } from './view.controller';
import { ViewService } from './view.service';

describe('ViewController', () => {
  let controller: ViewController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[ShareModule],
      controllers: [ViewController],
      providers:[ViewService]
    }).compile();

    controller = module.get<ViewController>(ViewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  
});
