import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';
import RedisMock from "./redis.mock";


describe('RedisService', () => {
  let redisService: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedisService],
    }).overrideProvider(RedisService).useValue(RedisMock).compile();

    redisService = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(redisService).toBeDefined();
  });
  it('should be equal', async () => {
    const keyId = 'test-key';
    const value = 'test-value';
    await redisService.setValueToRedis(keyId, value);
    const redisValue = await redisService.getValueToRedis(keyId);
    expect(value == redisValue).toBeTruthy();
  });

  it('should not be equal', async () => {
    const keyId = 'test-key';
    const value = 'test-value';
    await redisService.setValueToRedis(keyId, value);
    const redisValue = await redisService.getValueToRedis(keyId);
    expect('awdasddws' == redisValue).toBeFalsy();
  });

});
