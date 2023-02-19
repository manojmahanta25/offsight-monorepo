import { Test, TestingModule } from '@nestjs/testing';
import { KeypairService } from './keypair.service';
import { RedisService } from '../redis/redis.service';
import RedisMock from "../redis/redis.mock";

describe('KeypairService', () => {
  let keypairService: KeypairService;
  const keyId = 26;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KeypairService,RedisService],
    }).overrideProvider(RedisService).useValue(RedisMock).compile();

    keypairService = module.get<KeypairService>(KeypairService);
  });

  it('should be defined', () => {
    expect(keypairService).toBeDefined();
  });

  it('should be valid', () => {
    const keyPair = keypairService.GenerateKeyPair();
    expect(keyPair.publicKey).toContain('-----BEGIN RSA PUBLIC KEY-----');
    expect(keyPair.publicKey).toContain('-----END RSA PUBLIC KEY-----');
    expect(keyPair.privateKey).toContain('-----BEGIN PRIVATE KEY-----');
    expect(keyPair.privateKey).toContain('-----END PRIVATE KEY-----');
  });

  it('should be equal', async () => {
    const keyPair = await keypairService.setKeyPairToRedisSync(keyId);
    const keyFromRedis = await keypairService.getKeyPairFromRedis(keyId);
    expect(keyPair.publicKey == keyFromRedis.publicKey).toBeTruthy();
    expect(keyPair.privateKey == keyFromRedis.privateKey).toBeTruthy();
    expect(keyPair.publicKey == keyFromRedis.privateKey).toBeFalsy();
    expect(keyPair.privateKey == keyFromRedis.publicKey).toBeFalsy();
  });
});
