import { Injectable } from '@nestjs/common';
import {authRedisClient as redisClient} from '../../config/redis/redisClient';
@Injectable()
export class RedisService {
  async setValueToRedis(key: string, value: string) {
    await redisClient.set(key, value);
  }

  async getValueToRedis(key: string): Promise<string> {
    return await redisClient.get(key);
  }

  async checkKeyExist(key: string): Promise<number> {
    return await redisClient.exists(key);
  }

  async delKey(key: string): Promise<number> {
    return await redisClient.del(key);
  }
}
