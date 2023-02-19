import { Test, TestingModule } from '@nestjs/testing';
import { ViewService } from './view.service';
import { ViewModule } from './view.module';

describe('ViewService', () => {
  let service: ViewService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ViewModule],
      providers: [ViewService],
    }).compile();
    service = module.get<ViewService>(ViewService);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  it('[ViewService] should be able to create', async () => {
    const result = service.createView(78, 175, {
      feed_view_name: 'View Name 1',
    });
    await expect(result).resolves.toHaveProperty('');
  });

});
