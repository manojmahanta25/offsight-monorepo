import {MD5, enc, SHA1} from 'crypto-js';
import {v4 as uuidv4} from 'uuid';
import {Injectable} from "@nestjs/common";
import {generate} from "rxjs";

@Injectable()
export class SaltUtil {


    constructor() {
    }


    randomAlphaNumericString = (length: number): string => {
        const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
        let result = '';
        for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }

    encryptMd5 = (text: string): string => {
        return MD5(text).toString(enc.Hex);
    }

    encryptSha1 = (text: string): string => {
        return SHA1(text).toString(enc.Hex)
    }

    secureHash = (text: string, salt: string): string => {
        const key = this.encryptMd5('offsight');
        let digest = key
        for(let i = 0; i < 10; i++){
            digest = this.encryptSha1(digest + "--" + salt + "--" + text + "--" + key)
        }
        return digest;
    }

    generateSalt = (): string => {
        const randomString = this.encryptMd5(this.randomAlphaNumericString(16));
        return this.secureHash(randomString, '');
    }

    comparePassword = (password: string, passwordHash: string, salt: string): boolean => {
        const hash = this.secureHash(password, salt);
        return (passwordHash == hash);
    }

    comparePasswordMd5 = (password: string, passwordHash: string): boolean => {
        const hash = this.encryptMd5(password);
        return (passwordHash == hash);
    }

    generateUUID = (): string => {
        return uuidv4()
    }

}