import {Injectable, NotFoundException} from '@nestjs/common';
import {UserGroupModel} from "@app/model";
import {UserGroupMinimalDto, UserGroupUpdateAllDto} from "./user-group.dto";
import {ExcelService} from "@app/common";
import {UserGroupModelCache} from "../../model/usergroup-model.cache";

@Injectable()
export class UserGroupService {
    constructor(
        private userGroupModelCache: UserGroupModelCache,
        private excelService: ExcelService,
    ) {
    }

    async createUserGroup(clientId: number, userGroupDto: UserGroupMinimalDto): Promise<UserGroupModel> {
        return await this.userGroupModelCache.create({
            clientId: clientId,
            userGroupName: userGroupDto.groupName,
            loginAccessManagementTool: userGroupDto.loginAccessManagementTool,
            enablePasswordResetNoUserEmail: userGroupDto.enablePasswordResetNoUserEmail
        });
    }

    async updateUserGroup(clientId: number, userGroupId: number, userGroupDto: Partial<UserGroupUpdateAllDto>): Promise<UserGroupModel> {

        const update = await this.userGroupModelCache.update(userGroupDto, {where: {id: userGroupId, clientId}});
        if (update[0] === 0) {
            throw new NotFoundException('User Group not found');
        }
        return await this.userGroupModelCache.findByUserGroupIdAndClientId(userGroupId, clientId);
    }

    async deleteUserGroup(clientId: number, userGroupId: number): Promise<boolean> {
        const destroy = await this.userGroupModelCache.delete({where: {clientId: clientId, id: userGroupId}});
        if (destroy === 0) {
            throw new NotFoundException('User Group not found');
        }
        return true;
    }

    listUserGroup(clientId: number): Promise<UserGroupModel[]> {
        return this.userGroupModelCache.findAll({where: {clientId: clientId}});
    }

    async getUserGroup(clientId: number, userGroupId: number): Promise<UserGroupModel> {
        return  this.userGroupModelCache.findByUserGroupIdAndClientId(userGroupId, clientId);
    }

    downloadExcelUserGroup(clientId: number) {
        //download excel for usergroup
        const header = [
            {
                key: 'userGroupName',
                header: 'User Group Name'
            },
            {
                key: 'loginAccessManagementTool',
                header: 'Login Access: Management Tool'
            },
            {
                key: 'enablePasswordResetNoUserEmail',
                header: 'Enable Password Reset: No User Email'
            },
            // {
            //     key: '',
            //     header: 'Auto Logout Time: In Minutes'
            // },
            {
                key: 'userGroupOrder',
                header: 'User Group Order'
            },

        ];
        const options = {}
        const userGroup = this.listUserGroup(clientId);
        return this.excelService.downloadExcel(userGroup, header, options);

    }

   async setOrderUserGroup(clientId: number, userGroups: Partial<UserGroupModel>[]) {
        userGroups = userGroups.filter(userGroup => userGroup.clientId === clientId).filter(userGroup => userGroup.id !== null);
        userGroups = userGroups.map((userGroup, index) => {
            userGroup.userGroupOrder = index + 1;
            return userGroup;
        });
        await this.userGroupModelCache.createBulk(userGroups);
        return this.listUserGroup(clientId);
    }

}
