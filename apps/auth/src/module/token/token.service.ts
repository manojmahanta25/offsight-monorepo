import {Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "../../service/jwt-service/jwt.service";
import {authRedisClient as client} from "../../config/redis/redisClient";
import {JwtPayload} from "jsonwebtoken";
import {JwtPayloadInterface} from "@app/common/interfaces/jwt-payload.interface";

@Injectable()
export class TokenService {
    private BLACKLIST_={
        TOKEN: 'BLACKLIST_TOKEN',
        USER: 'BLACKLIST_USER'
    };
    constructor(private jwtService: JwtService) {
    }

    async decodeToken(token: string) {
        const decodeToken = await this.jwtService.decodeToken(token) as JwtPayloadInterface;
        if (!decodeToken) {
            throw new UnauthorizedException('Token is invalid')
        }
        const isBlackListed = await this.isBlackListed(decodeToken.clientId,decodeToken.userId, token);
        if (isBlackListed) {
            throw new UnauthorizedException('Token is invalid')
        }
        return decodeToken;
    }



    async invalidateToken(token: string) {
        const decodeToken = await this.jwtService.decodeToken(token) as JwtPayload;
        if (!decodeToken) {
            return true
        }
        const expireTime = decodeToken.exp - Date.now() / 1000
        await client.hSet(this.BLACKLIST_.TOKEN, token,'revoked');
        await client.expire(this.BLACKLIST_.TOKEN+':'+token, expireTime);
    }

    async invalidedUser(clientId:number,userId: number, permanent: boolean = false) {
        await client.hSet(this.BLACKLIST_.USER, userId.toString(), JSON.stringify({clientId, permanent}));
        if (permanent) {
            await client.expire(this.BLACKLIST_.USER+':'+userId, -1);
        }
    }

    async isBlackListedUser(userId: number): Promise<boolean> {
        const blackListUser = await client.hExists(this.BLACKLIST_.USER, userId.toString());
        console.log(blackListUser);
        return blackListUser;

    }

    async isBlackListedToken(token: string): Promise<boolean> {
        const blackListToken = await client.hExists(this.BLACKLIST_.TOKEN, token);
        console.log(blackListToken );
        return blackListToken;

    }

    async isBlackListed(clientId:number,userId: number, token: string) {
        const blackListedUser = await this.isBlackListedUser(userId);
        const blackListedToken = await this.isBlackListedToken(token);
        if(blackListedToken){
            return true;
        }
        if (blackListedUser) {
            const blackListedUserJson = JSON.parse(await client.hGet(this.BLACKLIST_.USER, userId.toString()));
            if (blackListedUserJson.clientId === clientId) {
                return true;
            }
            if(blackListedUserJson.clientId === 0){
                return true;
            }
        }
        return false;
    }



    async removeBlackListedUser(userId: number) {
        const blackListedUser = await this.isBlackListedUser(userId);
        if (blackListedUser) {
            const blackListedUserJson = JSON.parse(await client.hGet(this.BLACKLIST_.USER, userId.toString()));
            if (blackListedUserJson.permanent) {
                return;
            }
        }
        await client.hDel(this.BLACKLIST_.USER, userId.toString());
    }
}