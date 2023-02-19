import {Inject, Injectable} from "@nestjs/common";
import {ClientModel, UserClientPivotModel, UserModel} from "@app/model";
import {userRedisClient} from "../config/redis/redisClient";
import {CacheClass} from "./common.cache";
import {WhereOptions, Includeable, FindOptions} from "sequelize";

@Injectable()
export class UserModelCache {
    private _expireTimeInSeconds = 60 * 60 * 24 * 7; // 7 days
    private _USER_KEYS = {
        barcode: 'user:barcodeId:',
        username: 'user:username:',
        id: 'user:userId:',
    }

    constructor(
        @Inject('UserModelRepository') private userModel: typeof UserModel,
        private cacheClient: CacheClass,
    ) {
        this.cacheClient.setCacheAndExpire(userRedisClient, this._expireTimeInSeconds);
    }


    async findAll(options: FindOptions<UserModel>) {
        return await this.userModel.findAll(options);
    }


    async create(user: Partial<UserModel>) {
        return await this.userModel.create(user);
    }

    async findOne(options: FindOptions<UserModel>) {
        return await this.userModel.findOne(options);
    }


    async findByUserIdForLogin(userId: number): Promise<UserModel> {
        const key = this._USER_KEYS.id + userId;
        if (await this.cacheClient.cacheExists(key)) {
            return await this.cacheClient.cacheGet<UserModel>(key);
        }
        const user = await this.userModel.findOne({
            where: {id: userId},
            include: [
                {
                    model: ClientModel,
                    where: {isActive: 1},
                    through:{where:{isActive:1}},
                }]
        });
        if (user) {
           await this.cacheClient.cacheSet(key, user);
        }
        return user;
    }

    async findByUserIdIncludeClient(userId: number) {
        const key = this._USER_KEYS.id + userId+':client';
        if (await this.cacheClient.cacheExists(key)) {
            return await this.cacheClient.cacheGet<UserModel>(key);
        }
        const user = await this.userModel.findByPk(userId, {
            include: [
                {
                model: ClientModel,
                where: {isActive: 1},
                through:{attributes:[], where:{isActive:1}},
                attributes: ['id', 'name', 'logo' ]
            }],
            attributes:{exclude:['password','userSlug','userSid']}
        })
        if (user) {
            await this.cacheClient.cacheSet(key, user);
        }
        return user;
    }

    async findByUsernameForLogin(username: string) {
        const key = this._USER_KEYS.username + username;
        if (await this.cacheClient.cacheExists(key)) {
            return await this.cacheClient.cacheGet<UserModel>(key);
        }
        const user = await this.userModel.findOne({
            where: {username}, include: [ClientModel, {model: UserClientPivotModel, where: {isActive: 1}}]
        });
        if (user) {
           await this.cacheClient.cacheSet(key, user);
        }
        return user;
    }

    async findByBarcodeId(barcodeId: string) {
        const key = this._USER_KEYS.barcode + barcodeId;
        if (await this.cacheClient.cacheExists(key)) {
            return await this.cacheClient.cacheGet<UserModel>(key);
        }
        const user = await this.userModel.findOne({
            where: {barcodeId},
            include: [
                {
                    model: ClientModel,
                    where: {isActive: 1},
                    through:{where:{isActive:1}},
                }]
        });
        if (user) {
           await this.cacheClient.cacheSet(key, user);
        }
        return user;
    }

    async updateByUserId(userUpdate: Partial<UserModel>, userId: number) {
        const update = this.userModel.update(userUpdate, {where: {id: userId}});
        const user = await this.userModel.findByPk(userId, {
            include: [
                {
                    model: ClientModel,
                    where: {isActive: 1},
                    through:{where:{isActive:1}},
                }]
        })
        await this.updateUserCache(user);
        return update;
    }

    async update(userUpdate: Partial<UserModel>, where: WhereOptions<UserModel>) {
        const update = this.userModel.update(userUpdate, {where});
        const user = await this.userModel.findOne({where,
            include: [
                {
                    model: ClientModel,
                    where: {isActive: 1},
                    through:{where:{isActive:1}},
                }]
        });
        await this.updateUserCache(user);
        return update;
    }

   async updateUserCache(user: UserModel) {
        await this.cacheClient.cacheSet(this._USER_KEYS.barcode + user.barcodeId, user);
        await this.cacheClient.cacheSet(this._USER_KEYS.username + user.username, user);
        await this.cacheClient.cacheSet(this._USER_KEYS.id + user.id, user);
        await this.cacheClient.cacheDel(this._USER_KEYS.id + user.id+':client');
    }

    async deleteUserCache(user: UserModel) {
        await this.cacheClient.cacheDel(this._USER_KEYS.barcode + user.barcodeId);
        await this.cacheClient.cacheDel(this._USER_KEYS.username + user.username);
        await this.cacheClient.cacheDel(this._USER_KEYS.id + user.id);
        await this.cacheClient.cacheDel(this._USER_KEYS.id + user.id+':client');
    }

    updateNoCache(user: Partial<UserModel>, where: WhereOptions<UserModel>) {
        return this.userModel.update(user, {where});
    }

    async removeCacheByUserId(userId: number) {
        const user = await this.userModel.findByPk(userId)

        if (user) {
            await this.deleteUserCache(user);
        }


    }

}

