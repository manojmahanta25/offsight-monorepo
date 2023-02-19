import {
    ConflictException, ForbiddenException,
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
import {TwilioService} from 'nestjs-twilio';
import {LoginService} from "../login/login.service";
import {SaltUtil} from "../../utils/salt/salt.util";
import {QrCodeUtil} from "../../utils/qrcode/qr-code.util";
import {UserModelCache} from "../../model/user-model.cache";
import {authRedisClient as redisClient} from "../../config/redis/redisClient";
import {VerifyTokenInterface} from "../../interface/login.interface";


@Injectable()
export class TwoFactorAuthService {
    private _verificationSID: string = process.env.VERIFICATION_SID || 'VA457a2ab708f24627a15c2a7a99df6e52';

    constructor(private twilioService: TwilioService,
                private loginService: LoginService,
                private saltUtil: SaltUtil,
                private qrCodeUtil: QrCodeUtil,
                private userModelCache:UserModelCache
    ) {
    }

    async enableTwoFactorAuth(userId, name, force: boolean = true) {
        const user = await this.userModelCache.findByUserIdForLogin(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (user.user2faEnable && !force) {
            throw new ConflictException('User already has 2FA enabled');
        }

        const uuid = (user.userSlug)? user.userSlug : this.saltUtil.generateUUID();

        const twilioResponse = await this.setupTwilio(uuid, name);

        if (!twilioResponse) {
            throw new InternalServerErrorException('Error setting up twilio');
        }

        const identity = twilioResponse.identity;
        const sid = twilioResponse.sid;

        await this.userModelCache.updateNoCache({user2faEnable: false, userSid: sid, userSlug: identity}, {id: userId});
        await this.userModelCache.removeCacheByUserId(userId);
        const url = twilioResponse.binding.uri
        const imageString = await this.qrCodeUtil.generateQrCode(url);
        return { qrCode: imageString };
    }

    async verifyToEnable2Fa(userId: number, code: number) {
        const user = await this.userModelCache.findByUserIdForLogin(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if(user.user2faEnable){
            throw new ConflictException('User already has 2FA enabled');
        }

        if (user.userSid === '' || user.userSlug === '') {
            throw new NotFoundException('User does not have 2FA enabled');
        }

        const sid = user.userSid;
        const uuid = user.userSlug;
        const result = await this.setupTwilioFactor(uuid, sid, code);
        console.log('result',result);
        if (!result) {
            throw new ForbiddenException('Invalid code');
        }

        await this.userModelCache.updateNoCache({user2faEnable: true}, {id: userId});
        await this.userModelCache.removeCacheByUserId(userId);
        return '2fa enabled successfully';
    }


    async disableTwoFactorAuth(userId: number, code: number) {
        const user = await this.userModelCache.findByUserIdForLogin(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const optVerify = await this.verifyCodeTwilio(user.userSlug, user.userSid, code);
        if (!optVerify) {
            throw new UnauthorizedException('Invalid code');
        }
        const update = await this.userModelCache.updateNoCache({user2faEnable: false}, {id: userId});
        await this.userModelCache.removeCacheByUserId(userId);
        if (update[0] === 0) {
            throw new InternalServerErrorException('Error disabling 2FA');
        }
        return '2FA disabled successfully';
    }

    async twoFactorAuthLogin(token:string,code: number) {
        const checkToken = await redisClient.exists(token)
        if(!checkToken){
            throw new UnauthorizedException('Timeout! Please login again! ');
        }
        const tokenData = JSON.parse(await redisClient.get(token)) as VerifyTokenInterface;
        const user = await this.userModelCache.findByUserIdForLogin(tokenData.userId);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        if (!user.user2faEnable) {
            throw new UnauthorizedException('2FA not enabled');
        }
        const optVerify = await this.verifyCodeTwilio(user.userSlug, user.userSid, code);
        if (!optVerify) {
            throw new UnauthorizedException('Invalid otp code');
        }
        const tokenPayloadUpdate:VerifyTokenInterface = {
            ...tokenData,
            isOtpVerified: true,
        }
        await redisClient.set(token, JSON.stringify(tokenPayloadUpdate));
        return {verifyToken: token};
    }

    setupTwilio(user_uuid: string, friendlyName: string = 'Offsight') {
        return this.twilioService.client.verify.v2.services(this._verificationSID).entities(user_uuid).newFactors.create({
            friendlyName: friendlyName,
            factorType: 'totp'
        });
    }

    async setupTwilioFactor(uuid: string, sid: string, code: number): Promise<boolean> {
        const response = await this.twilioService.client.verify.v2.services(this._verificationSID)
            .entities(uuid)
            .factors(sid)
            .update({authPayload: String(code)});
        if (!response) {
            throw new InternalServerErrorException('Error verifying code');
        }
        console.log('response',response);
        return response.status === 'verified';

    }

    async verifyCodeTwilio(uuid: string, sid: string, code: number): Promise<boolean> {
        const response = await this.twilioService.client.verify.v2.services(this._verificationSID)
            .entities(uuid)
            .challenges
            .create({
                authPayload: String(code),
                factorSid: sid
            })
        if (!response) {
            throw new InternalServerErrorException('Error verifying code');
        }
        return response.status === 'approved';

    }


}
