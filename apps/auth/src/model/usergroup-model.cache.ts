import {Inject} from "@nestjs/common";
import {UserGroupModel} from "@app/model";
import {CacheClass} from "./common.cache";
import {userRedisClient} from "../config/redis/redisClient";
import {FindOptions, WhereOptions} from "sequelize";

export class UserGroupModelCache {

    private _USER_GROUP_KEYS = {
        id: 'userGroup:userGroupId:',
        clientId: 'userGroup:clientId:',
    }

    constructor(
        @Inject('UserGroupModelRepository') private userGroupModel: typeof UserGroupModel,
        private cacheClient: CacheClass,
    ) {
        this.cacheClient.setCacheAndExpire(userRedisClient);
    }


    async findByUserGroupIdAndClientId(userGroupId: number, clientId: number) {
        const key = this._USER_GROUP_KEYS.id + userGroupId + this._USER_GROUP_KEYS.clientId + clientId;
        if (await this.cacheClient.cacheExists(key)) {
            return await this.cacheClient.cacheGet<UserGroupModel>(key);
        }
        const userGroupModel = await this.userGroupModel.findOne({where: {id: userGroupId, clientId}});
        if (userGroupModel) {
            this.cacheClient.cacheSet(key, userGroupModel);
        }
        return userGroupModel;
    }

    async create(userGroup: Partial<UserGroupModel>) {
        return await this.userGroupModel.create(userGroup);
    }

    async findAll(options: FindOptions<UserGroupModel>) {
        return await this.userGroupModel.findAll(options);
    }

    async findOne(options: FindOptions<UserGroupModel>) {
        return await this.userGroupModel.findOne(options);
    }

    async update(userGroup: Partial<UserGroupModel>, where: WhereOptions<UserGroupModel>) {
        const update = await this.userGroupModel.update(userGroup, {where});
        await this.userGroupModel.findOne({where}).then(userGroup => {
            if (userGroup) {
                this.cacheClient.cacheSet(this._USER_GROUP_KEYS.id + userGroup.id + this._USER_GROUP_KEYS.clientId + userGroup.clientId, userGroup);
            }
        });
        return update;
    }

    async delete(where: WhereOptions<UserGroupModel>) {
        const userGroup = await this.userGroupModel.findOne({where});
        if (userGroup) {
           await this.cacheClient.cacheDel(this._USER_GROUP_KEYS.id + userGroup.id + this._USER_GROUP_KEYS.clientId + userGroup.clientId);
        }
        return await this.userGroupModel.destroy({where});
    }

    async createBulk(userGroups:Partial<UserGroupModel>[]){
       const userGroupModel = await this.userGroupModel.bulkCreate(userGroups, {updateOnDuplicate: ['userGroupOrder']});
       userGroups.forEach(userGroup => {
              this.cacheClient.cacheDel(this._USER_GROUP_KEYS.id + userGroup.id + this._USER_GROUP_KEYS.clientId + userGroup.clientId);
       });
         return userGroupModel;
    }
}