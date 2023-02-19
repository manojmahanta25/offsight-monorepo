import {Injectable} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import {KeypairService} from '../keypair/keypair.service';

@Injectable()
export class JwtService {
    constructor(private readonly keypairService: KeypairService) {
    }

    async generateToken(payLoad: object,expire:number): Promise<string> {
        const keyId = Math.floor(Math.random() * 5 + 1);
        const {privateKey} = await this.keypairService.getOrSetKeyPairToRedis(
            keyId,
        );
        return jwt.sign(payLoad, privateKey, {
                algorithm: "RS256",
                header: {
                    alg: "RS256",
                    kid: keyId.toString()
                },
            expiresIn:expire
            }
        );
    }

    async decodeToken(token: string)  {
        try {
            const tokenHeader = this.getTokenHeader(token);
            if (!tokenHeader) {
                throw new Error('Invalid Token');
            }
            const keyId = Number(tokenHeader.kid);
            const {publicKey} = await this.keypairService.getKeyPairFromRedis(
                keyId,
            );
            return  jwt.verify(token, publicKey);
        } catch (e) {
            return null;
        }
    }

    getTokenHeader(token: string) {
        try {
            const header = jwt.decode(token, {complete: true}).header;
            if (!header) {
                throw new Error('Invalid header');
            }
            if (header.alg != 'RS256') {
                throw new Error('Invalid header algorithm missing');
            }
            return header;
        } catch (e) {
            return null;
        }
    }
}
