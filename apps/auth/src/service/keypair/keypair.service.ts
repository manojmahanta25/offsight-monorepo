import { Injectable } from '@nestjs/common';
import {
  generateKeyPair,
  generateKeyPairSync,
  KeyPairSyncResult,
} from 'crypto';
import { Buffer } from 'buffer';
import { RedisService } from '../redis/redis.service';
import * as sshpk from 'sshpk';

@Injectable()
export class KeypairService {
  KEY_PAIR_PREFIX = `keyPair-`;
  constructor(private redisService: RedisService) {}

  GenerateKeyPair(): KeyPairSyncResult<string, string> {
    return generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });
  }

  generateRsaKey(id = 1) {
    let genPublicKey, genPrivateKey;
    generateKeyPair(
      'rsa',
      {
        modulusLength: 4096, // options
        publicKeyEncoding: {
          type: 'pkcs1',
          format: 'pem',
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem',
        },
      },
      (err, publicKey, privateKey) => {
        if (!err) {
          genPublicKey = sshpk.parseKey(publicKey, 'pem').toString('pem');
          genPrivateKey = sshpk.parsePrivateKey(privateKey, 'pem').toString();
          const base64PublicKey = this.convertKeyToString(genPublicKey);
          const base64PrivateKey = this.convertKeyToString(genPrivateKey);
          const keyPairBase64 = { base64PublicKey, base64PrivateKey };
          this.redisService
            .setValueToRedis(
              `${this.KEY_PAIR_PREFIX}${id}`,
              JSON.stringify(keyPairBase64),
            )
            .then(() => {
              console.log('added to redis');
            });
        } else {
          console.log('Err is: ', err);
        }
        return;
      },
    );
    return { genPublicKey, genPrivateKey };
  }

  convertKeyPairToString(keyPair: KeyPairSyncResult<string, string>): {
    base64PublicKey: string;
    base64PrivateKey: string;
  } {
    const genPublicKey = sshpk
      .parseKey(keyPair.publicKey, 'pem')
      .toString('pem');
    const genPrivateKey = sshpk
      .parsePrivateKey(keyPair.privateKey, 'pem')
      .toString();
    const base64PublicKey = this.convertKeyToString(genPublicKey);
    const base64PrivateKey = this.convertKeyToString(genPrivateKey);
    return { base64PublicKey, base64PrivateKey };
  }

  convertStringToKeyPair(
    publicKeyString: string,
    privateKeyString,
  ): { publicKey: string; privateKey: string } {
    let privateKey = this.convertStringToKey(privateKeyString);
    let publicKey = this.convertStringToKey(publicKeyString);
    publicKey = sshpk.parseKey(publicKey, 'pem').toBuffer('pkcs1');
    privateKey = sshpk.parsePrivateKey(privateKey, 'pem').toBuffer('pkcs8');
    return {
      publicKey,
      privateKey,
    };
  }

  convertKeyToString(bufferKey: string) {
    return Buffer.from(bufferKey, 'utf-8').toString('base64');
  }

  convertStringToKey(stringKey: string) {
    return Buffer.from(stringKey, 'base64').toString('utf-8');
  }

  async setKeyPairToRedisSync(
    id = 1,
  ): Promise<KeyPairSyncResult<string, string>> {
    try {
      const keyPair = this.GenerateKeyPair();
      const keyPairBase64 = this.convertKeyPairToString(keyPair);
      await this.redisService.setValueToRedis(
        `keyPair-${id}`,
        JSON.stringify(keyPairBase64),
      );
      return keyPair;
    } catch (e) {
      console.log(e);
    }
  }

  setKeyPairToRedis() {
    this.generateRsaKey(1);
    this.generateRsaKey(2);
    this.generateRsaKey(3);
    this.generateRsaKey(4);
    this.generateRsaKey(5);
  }

  async getOrSetKeyPairToRedis(id = 1): Promise<{
    publicKey: string;
    privateKey: string;
  }> {
    const check = await this.redisService.checkKeyExist(
      `${this.KEY_PAIR_PREFIX}${id}`,
    );
    if (check > 0) {
      return await this.getKeyPairFromRedis(id);
    } else {
      const keyPair = await this.setKeyPairToRedisSync(id);
      return { publicKey: keyPair.publicKey, privateKey: keyPair.privateKey };
    }
  }

  async getKeyPairFromRedis(
    id = 1,
  ): Promise<{ publicKey: string; privateKey: string }> {
    const keyPairString = JSON.parse(
      await this.redisService.getValueToRedis(`${this.KEY_PAIR_PREFIX}${id}`),
    );

    return this.convertStringToKeyPair(
      keyPairString['base64PublicKey'],
      keyPairString['base64PrivateKey'],
    );
  }
}
