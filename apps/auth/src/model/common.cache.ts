import {RedisClientType} from "redis";
import {Injectable} from "@nestjs/common";

@Injectable()
export class CacheClass {
    private _cache: RedisClientType
    private _expireTime: number;

    setCacheAndExpire(cache: RedisClientType, expireTime: number=60 * 60 * 24 * 7) {
        this._cache = cache;
        this._expireTime = expireTime;
    }

    async cacheSet(key: string, value: any) {
       await this._cache.set(key, JSON.stringify(value), {EX: this._expireTime}).then(r => {
            return r;
        });
        return value;
    }

    async cacheGet<Type>(key: string): Promise<Type> {
        return JSON.parse(await this._cache.get(key)) as Type;
    }

    cacheDel(...keys: string[]) {
        return this._cache.del(keys);
    }


    cacheExists(key: string) {
        return this._cache.exists(key);
    }
}