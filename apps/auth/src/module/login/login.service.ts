import {BadRequestException, ForbiddenException, Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '../../service/jwt-service/jwt.service';
import {UserModel} from "@app/model/User/user.model";
import {SaltUtil} from "../../utils/salt/salt.util";
import {UserAuthModel} from "@app/model/User/user-auth.model";
import {JwtPayloadInterface, UserGroupPermissionInterface} from "@app/common/interfaces/jwt-payload.interface";
import {
    ClientSelectInterface,
    ClientUserInterfaceWith2FA,
    SingleClientUserInterfaceWith2FA,
    TokenAndRefresher, VerifyTokenInterface
} from "../../interface/login.interface";
import {Request, Response} from "express";
import {HeadersEnum} from "@app/common/enums/headers.enum";
import {UserGroupModel} from "@app/model/User/user-group.model";
import {UserModelCache} from "../../model/user-model.cache";
import {UserGroupModelCache} from "../../model/usergroup-model.cache";
import {authRedisClient as redisClient} from '../../config/redis/redisClient';
import {TokenService} from "../token/token.service";

@Injectable()
export class LoginService {
    constructor(
        @Inject('UserAuthModelRepository') private userAuthModel: typeof UserAuthModel,
        private jwtService: JwtService,
        private saltUtil: SaltUtil,
        private userModelCache: UserModelCache,
        private userGroupModelCache: UserGroupModelCache,
        private tokenService: TokenService,
    ) {
    }

    isCaptchaVerify(captcha: string): boolean {
        //TODO if needed
        return true;
    }

    async authenticationWithUsername(username: string, password: string, deviceIdentifier: string, captcha: string): Promise<TokenAndRefresher | ClientUserInterfaceWith2FA | SingleClientUserInterfaceWith2FA> {
        if (!this.isCaptchaVerify(captcha)) {
            throw new BadRequestException('captcha not verified');
        }
        const usersFetch = await this.verifyLogin(username, password);
        if (!usersFetch) {
            throw new UnauthorizedException('password or username mismatch');
        }
        await this.tokenService.removeBlackListedUser(usersFetch.id)
        return await this.checkMultipleClientAnd2FA(usersFetch, deviceIdentifier);
    }

    async checkMultipleClientAnd2FA(user: UserModel, deviceIdentifier: string): Promise<TokenAndRefresher | ClientUserInterfaceWith2FA | SingleClientUserInterfaceWith2FA> {
        const flag2FA = user.user2faEnable
        if (user?.clients.length > 1) {
            const client_result: ClientSelectInterface[] = user.clients.map((client) => {
                return {
                    clientId: client.id,
                    clientName: client.name,
                    clientLogo: client.logo,
                    clientSquareLogo: client.squareLogo,
                    username: user.username,
                }
            });
            const verifyToken = await this.setTokenToRedis( user, true, false)
            return {
                clients: client_result,
                isOtpScreen: flag2FA,
                isUserMultiAccount: true,
                verifyToken
            };


        } else {
            if (flag2FA) {
                const verifyToken = await this.setTokenToRedis( user, true, false)
                return {
                    clientId: user.clients[0].id,
                    isOtpScreen: flag2FA,
                    isUserMultiAccount: false,
                    verifyToken
                }
            } else {
                return await this.loginSuccess(user, deviceIdentifier, user.clients[0].id, false);
            }
        }
    }

    async setTokenToRedis(user: UserModel, isUserMultiAccount: boolean, isOtpVerified: boolean, isBarcodeIdLogin:boolean=false): Promise<string> {
        const check2FA = (isBarcodeIdLogin)? false :user.user2faEnable
        const payload:VerifyTokenInterface = {
            userId: user.id,
            username: user.username,
            isUserMultiAccount: isUserMultiAccount,
            isOtpVerified,
            is2faEnable: check2FA,
        }
        const tokenKey = this.saltUtil.secureHash('user-token', this.saltUtil.generateUUID())
        await redisClient.set(tokenKey, JSON.stringify(payload), {
            EX: 60 * 5 // 5 minutes
        })
        return tokenKey
    }


    async authenticateWithVerifyToken(token: string, clientId: number, deviceIdentifier: string): Promise<TokenAndRefresher> {
        const checkToken = await redisClient.exists(token)
        if (!checkToken) {
            throw new UnauthorizedException('Timeout! Please login again! ');
        }
        const tokenData = JSON.parse(await redisClient.get(token)) as VerifyTokenInterface
        await redisClient.del(token)
        if (tokenData.is2faEnable) {
            if (tokenData.isOtpVerified) {
                const user = await this.userModelCache.findByUsernameForLogin(tokenData.username)
                return await this.loginSuccess(user, deviceIdentifier, user.clients[0].id, tokenData.isUserMultiAccount);
            } else {
                throw new UnauthorizedException('2FA not verified');
            }
        } else {
            const user = await this.userModelCache.findByUsernameForLogin(tokenData.username)
            if (!user) {
                throw new UnauthorizedException('user not found')
            }
            return await this.loginSuccess(user, deviceIdentifier, user.clients[0].id, tokenData.isUserMultiAccount);
        }


    }


    //
    async authenticationWithUsernameAndClientId(clientId: number, username: string, password: string, deviceIdentifier: string): Promise<TokenAndRefresher | SingleClientUserInterfaceWith2FA> {
        const usersFetch = await this.verifyLoginWithClientId(clientId, username, password);
        if (!usersFetch) {
            throw new UnauthorizedException('password or username mismatch');
        }
        await this.tokenService.removeBlackListedUser(usersFetch.id)
        const flag2FA = usersFetch.user2faEnable
        if (flag2FA) {
            const isMultiAccount = usersFetch.clients.length > 1
            const verifyToken = await this.setTokenToRedis( usersFetch, isMultiAccount, false)
            return {
                clientId: clientId,
                isOtpScreen: flag2FA,
                isUserMultiAccount: true,
                verifyToken
            }
        }
        return await this.loginSuccess(usersFetch, deviceIdentifier, clientId, true);
    }


    async authenticationWithBarcodeId(barcodeId: string, deviceIdentifier: string): Promise<TokenAndRefresher | ClientUserInterfaceWith2FA | SingleClientUserInterfaceWith2FA> {

        return this.verifyLoginWithBarcodeId(barcodeId, deviceIdentifier);
    }

    async authenticationWithBarcodeIdAndClientId(clientId: number, barcodeId: string, deviceIdentifier: string): Promise<TokenAndRefresher> {
        const user = await this.verifyLoginWithBarcodeIdAndClientId(clientId, barcodeId);
        if (!user) {
            throw new UnauthorizedException('invalid input');
        }
        return await this.loginSuccess(user, deviceIdentifier, clientId, true);
    }

    async refreshAccessToken(refresherToken: string, deviceIdentifier: string): Promise<TokenAndRefresher> {
        const refresherTokenAndSalt = refresherToken.split('.');
        const refresherTokenHash = this.saltUtil.secureHash(refresherTokenAndSalt[0], refresherTokenAndSalt[1]);
        const userAuth = await this.userAuthModel.findOne({
            where: {refresherToken: refresherTokenHash}
        });
        if (!userAuth) {
            throw new UnauthorizedException('Invalid refresher token');
        }
        if (userAuth.deviceIdentifier != deviceIdentifier) {
            await this.userAuthModel.destroy({where: {id: userAuth.id}})
            throw new UnauthorizedException('Invalid refresher token');
        }
        const refresherTokenDate = new Date(userAuth.createdAt);
        const startDate = new Date();
        const endDate = new Date(refresherTokenDate.getTime() + 1000 * 60 * 60 * 24 * 365);
        if (startDate > endDate) { // if token is older than 1 year
            await this.userAuthModel.destroy({where: {id: userAuth.id}})
            throw new UnauthorizedException('session expired, please login again');
        }
        const user = await this.userModelCache.findByUserIdForLogin(userAuth.userId);
        if (!user) {
            throw new UnauthorizedException('user not found');
        }
        const isUserMultiAccount = user.clients.length > 1;
        const userGroupId = user.clients.find(client => client.id == userAuth.clientId)['UserClientPivotModel'].userGroupId;
        new Promise(async (resolve, reject) => {
           const update = await this.userAuthModel.update({lastLoginIp: '0.0.0.0'}, {where: {id: userAuth.id}});
            resolve(update);
        })

        return await this.loginOutput(user, refresherToken, userAuth.clientId, userGroupId, isUserMultiAccount);
    }


    async loginSuccess(user: UserModel, deviceIdentifier: string, clientId: number, isMultiAccount: boolean) {
        const {refresherToken, salt} = await this.updateUserAuth(user, deviceIdentifier, clientId);
        return await this.loginOutput(user, `${refresherToken}.${salt}`, clientId, user.clients.find(client => client.id == clientId)['UserClientPivotModel'].userGroupId, isMultiAccount);
    }


    async loginOutput(user: UserModel, refresherTokenWithSalt: string,  clientId: number, userGroupId: number, isMultiAccount: boolean): Promise<TokenAndRefresher> {
        const userGroupModel: UserGroupModel = await this.userGroupModelCache.findByUserGroupIdAndClientId(userGroupId, clientId);
        if (!userGroupModel) {
            throw new UnauthorizedException('user group not found');
        }
        const userGroupPermission: UserGroupPermissionInterface = {
            loginAccessManagementTool: (userGroupModel.loginAccessManagementTool == 1),
            loginAccessStartEndProductTool: (userGroupModel.loginAccessStartEndProductTool == 1),
            loginAccessAlert: (userGroupModel.loginAccessAlert == 1),
            loginAccessHistory: (userGroupModel.loginAccessHistory == 1),
            loginAccessAnalytics: (userGroupModel.loginAccessAnalytics == 1),
            loginAccessReporting: (userGroupModel.loginAccessReporting == 1),
            loginAccessDeleteSubmittedTask: (userGroupModel.loginAccessDeleteSubmittedTask == 1),
            loginAccessEnablePauseProduction: (userGroupModel.loginAccessEnablePauseProduction == 1),
            enablePasswordResetNoUserEmail: (userGroupModel.enablePasswordResetNoUserEmail == 1),
        }
        let payload: JwtPayloadInterface = {
            username: user.username,
            clientId: clientId,
            userId: user.id,
            userGroupId: userGroupId,
            userTimeZone: user.timeZone,
            isUserMultiAccount: isMultiAccount,
            userGroupPermission: userGroupPermission
        };
        (user.email) ? payload.email = user.email : null;
        const token = await this.jwtService.generateToken(payload, 60 * 60)
        const isBlackList = await this.tokenService.isBlackListed(clientId,user.id,'')
        if(isBlackList) {
            throw new ForbiddenException('This User is blacklisted for this client ! Please contact admin');
        }
        return {
            token: token,
            refresherToken: refresherTokenWithSalt,
            gotoMgt: false,
            isUserMultiAccount: isMultiAccount
        };
    }

    async updateUserAuth(user: UserModel, deviceIdentifier: string, clientId: number): Promise<{ refresherToken: string, salt: string}> {
        const refresherToken = this.saltUtil.generateUUID();
        const salt = this.saltUtil.generateSalt();
        const hash = this.saltUtil.secureHash(refresherToken, salt);
        new Promise(async (resolve, reject) => {
            const userAuthExist = await this.userAuthModel.findOne({where: {deviceIdentifier}})
            if (userAuthExist) {
                await this.userAuthModel.update({
                    userId: user.id,
                    clientId: clientId,
                    refresherToken: hash,
                    refresherSalt: salt,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }, {where: {id: userAuthExist.id}})
                resolve ( {userAuthId: userAuthExist.id});
            } else {
                const userAuth = await this.userAuthModel.create({
                    userId: user.id,
                    clientId: clientId,
                    deviceIdentifier,
                    refresherToken: hash,
                    refresherSalt: salt,
                });

                resolve ({userAuthId: userAuth.id});
            }
        })
        return {refresherToken, salt};

    }

    async verifyLogin(username: string, password: string): Promise<UserModel> {
        const user = await this.userModelCache.findByUsernameForLogin(username);
        if (!user) {
            throw new UnauthorizedException('user not found');
        }
        if (user) {
            if (this.saltUtil.comparePasswordMd5(password, user.password)) {
                return user;
            }
        }
        return null;
    }

    async verifyLoginWithClientId(clientId: number, username: string, password: string): Promise<UserModel> {
        const user = await this.userModelCache.findByUsernameForLogin(username);
        if (!user) {
            throw new UnauthorizedException('user not found');
        }
        user.clients = user.clients.filter(c => c.id == clientId)
        if (user.clients.length == 0) {
            throw new UnauthorizedException('user not found');
        }
        return user;

    }

    async verifyLoginWithBarcodeId(barcodeId: string, deviceIdentifier: string): Promise<TokenAndRefresher | ClientUserInterfaceWith2FA | SingleClientUserInterfaceWith2FA> {
        const user = await this.userModelCache.findByBarcodeId(barcodeId);
        if (!user) {
            throw new UnauthorizedException('invalid input');
        }
        await this.tokenService.removeBlackListedUser(user.id)
        if (user.clients.length == 0) {
            throw new UnauthorizedException('user not found');
        }
        if (user.clients.length > 1) {
            const client_result: ClientSelectInterface[] = user.clients.map((client) => {
                return {
                    clientId: client.id,
                    clientName: client.name,
                    clientLogo: client.logo,
                    clientSquareLogo: client.squareLogo,
                    username: user.username,
                }
            });
            const isMultiAccount = user.clients.length > 1
            const verifyToken = await this.setTokenToRedis( user, isMultiAccount, false)
            return {
                clients: client_result,
                isUserMultiAccount: true,
                verifyToken: verifyToken
            };
        } else {

            return await this.loginSuccess(user, deviceIdentifier, user.clients[0].id, false);

        }
    }

    async verifyLoginWithBarcodeIdAndClientId(clientId: number, barcodeId: string): Promise<UserModel> {
        const user = await this.userModelCache.findByBarcodeId(barcodeId);
        if (!user) {
            throw new UnauthorizedException('invalid input');
        }
        await this.tokenService.removeBlackListedUser(user.id)
        user.clients = user.clients.filter(c => c.id == clientId)
        if (user.clients.length == 0) {
            throw new UnauthorizedException('user not found');
        }
        return user;

    }


    generateNewDeviceIdentifier(): string {
        const uuid = this.saltUtil.generateUUID()
        return this.saltUtil.secureHash('--device--', uuid);
    }

    getOrSetDeviceIdentifier(request: Request): string {
        let deviceIdentifier = request.header(HeadersEnum.DEVICE_IDENTIFIER) || request.cookies[HeadersEnum.DEVICE_IDENTIFIER];
        if (!deviceIdentifier) {
            deviceIdentifier = this.generateNewDeviceIdentifier()
        }
        return deviceIdentifier
    }

    loginResponse(response: Response, result: any, deviceIdentifier: string) {
        const AUTH_COOKIE_EXPIRE_IN_SECONDS = 60 * 60; //1 hour
        const REFRESHER_COOKIE_EXPIRE_IN_SECONDS = 365 * 24 * 60 * 60; //1 year
        response.cookie(HeadersEnum.DEVICE_IDENTIFIER, deviceIdentifier, {
            maxAge: 10 * 365 * 24 * 60 * 60 * 1000,
        });
        if (result['token']) {
            const resultOutput = result as TokenAndRefresher;
            response.cookie(HeadersEnum.AUTH_TOKEN, resultOutput.token, {
                maxAge: AUTH_COOKIE_EXPIRE_IN_SECONDS * 1000,
            })
            response.cookie(HeadersEnum.REFRESHER_TOKEN, resultOutput.refresherToken, {
                maxAge: REFRESHER_COOKIE_EXPIRE_IN_SECONDS * 1000,
            })
            return {
                ...resultOutput,
                expire: 60 * 60
            }
        } else {
            return result;
        }
    }


}
