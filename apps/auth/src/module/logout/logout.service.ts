import {Inject, Injectable, NotFoundException} from "@nestjs/common";
import {UserAuthModel} from "@app/model/User/user-auth.model";
import { Op } from 'sequelize';
import {ClientModel} from "@app/model";
import {TokenService} from "../token/token.service";

@Injectable()
export class LogoutService{

    constructor(@Inject('UserAuthModelRepository') private userAuthModel: typeof UserAuthModel,
                @Inject('UserModelRepository') private userModel: typeof UserAuthModel,
                private tokenService: TokenService,
                ) { }
    async logout(deviceIdentifier:string, token:string): Promise<boolean> {
        await this.tokenService.invalidateToken(token)
        await this.userAuthModel.update({
            refresherToken: null,
            refresherSalt: null,
        }, {where: {deviceIdentifier: deviceIdentifier}});
        return true;
    }

    async logoutAll(userId:number): Promise<boolean> {
        await this.tokenService.invalidedUser(0,userId);
        await this.userAuthModel.update({
            refresherToken: null,
            refresherSalt: null,
        }, {where: {userId: userId}});
        return true;
    }

    async logoutAllClientUser(clientId:number): Promise<boolean> {
        await this.userAuthModel.update({
            refresherToken: null,
            refresherSalt: null,
        }, {where: {clientId: clientId}});
        return true;
    }

    async logoutAllClientUserExceptCurrentDevice(clientId:number,deviceIdentifier:string): Promise<boolean> {
        await this.userAuthModel.update({
            refresherToken: null,
            refresherSalt: null,
        }, {where: {clientId: clientId,deviceIdentifier : {[Op.ne]: deviceIdentifier}}});
        return true;
    }

    async logoutAParticularClientUser(clientId:number,userId:number): Promise<boolean> {
        await this.tokenService.invalidedUser(clientId,userId);
        await this.userAuthModel.update({
            refresherToken: null,
            refresherSalt: null,
        }, {where: {clientId: clientId,userId:userId}});
        return true;
    }
}