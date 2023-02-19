import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from './jwt.service';
import { RedisService } from '../redis/redis.service';
import { KeypairService } from '../keypair/keypair.service';
import RedisMock from "../redis/redis.mock";


describe('JwtServiceService', () => {
  let service: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers:[JwtService,RedisService,KeypairService],
    }).overrideProvider(RedisService).useValue(RedisMock).compile();

    service = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate token', async () => {
    const token = await service.generateToken({id: 'hero'}, 3600);
    expect(token).toBeDefined();
  });

  it('should generate token and decode', async () => {
    const token = await service.generateToken({id: 'hero'}, 3600);
    const decode = await service.decodeToken(token);
    expect('hero' == decode['id']).toBeTruthy();
  });

  it('should throw error', async () => {
    const token = 'asdasdw.asdawdasdha-asdawd.awwww';
    const decode = await service.decodeToken(token);
    expect(decode).toBeNull();
  });

});
