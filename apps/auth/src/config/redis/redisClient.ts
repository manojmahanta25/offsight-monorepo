import {createClient, RedisClientType} from 'redis';
import {redisKeyConfig} from "@app/common/config/redis.config";
import {REDIS_DB} from "@app/common/enums/redisdb.enum";

const authRedisClient = createClient({
  url: `redis://${redisKeyConfig.host}:${redisKeyConfig.port}/${REDIS_DB.AUTH}`,
});

authRedisClient.on('error', (err) =>{}
    // console.log('Redis Client Error', err)
);

authRedisClient
  .connect()
  .then(() => {
    // console.log(`Redis has been initialized`);
  })
  .catch((err) => {
    // console.error(`Redis initialization error`, err);
  });

const userRedisClient:RedisClientType = createClient({
    url: `redis://${redisKeyConfig.host}:${redisKeyConfig.port}/${REDIS_DB.USER}`,
});

userRedisClient.on('error', (err) =>{}
    // console.log('Redis Client Error', err)
);
userRedisClient
    .connect()
    .then(() => {
        // console.log(`Redis has been initialized`);
    })
    .catch((err) => {
        // console.error(`Redis initialization error`, err);
    });


export  {
    authRedisClient,
    userRedisClient
};
