import {Inject, Injectable} from '@nestjs/common';
import {ClientModel} from "@app/model/Client/client.model";
import {UserModel} from "@app/model/User/user.model";
import {UserGroupModel} from "@app/model/User/user-group.model";
import {UserPermissionModel} from "@app/model/User/user-permission.model";
import {userType} from "@app/model/User/user.enum";
import {UserConfigModel} from "@app/model/User/user-config.model";
import {ClientAppSettingsModel} from "@app/model/Client/client-app-settings.model";
import {UserClientPivotModel} from "@app/model/User/user-client-pivot.model";


@Injectable()
export class CreateClientService{
    constructor(
        @Inject('ClientModelRepository')
        private clientModel: typeof ClientModel,
        @Inject('UserClientPivotModelRepository')
        private userClientPivotModel: typeof UserClientPivotModel,
        @Inject('UserModelRepository')
        private userModel: typeof UserModel,
        @Inject('UserGroupModelRepository')
        private userGroupModel: typeof UserGroupModel,
        @Inject('UserPermissionModelRepository')
        private userPermissionModel: typeof UserPermissionModel,
        @Inject('UserConfigModelRepository')
        private userConfigModel: typeof UserConfigModel,
        @Inject('ClientAppSettingsModelRepository')
        private clientAppSettingsModel: typeof ClientAppSettingsModel
    ) {
    }

    async createAccount(email: string, name: string) {
        const clientExist = await this.checkClient(email);
        if (clientExist) {
            throw new Error('A client with same email id already exists.');
        }
        const userExist = await this.checkUser(email);
        if (userExist) {
            throw new Error('A client with same email id already exists.');
        }
        const client = await this.creatNewClient(email, name);

        await this.createDefaultAppSettings(client.id);

        const userGroup = await this.createDefaultUserGroups(client.id);

        await this.createNewUser(email, name, client.id, userGroup.id);

        return client.id;
    }

    private async checkClient(email: string): Promise<boolean> {
        const client = await this.clientModel.count({where: {email}})
        return (client > 0);
    }

    private async checkUser(email: string): Promise<boolean> {
        const user = await this.userModel.count({where: {email}})
        return (user > 0);
    }

    private createDefaultUserGroups(clientId: number): Promise<UserGroupModel> {

        return this.userGroupModel.create({
            clientId,
            userGroupName: 'Admin',
            loginAccessManagementTool: 1,
            loginAccessStartEndProductTool: 1,
            loginAccessHistory: 1,
            loginAccessEnablePauseProduction: 1,
            enablePasswordResetNoUserEmail: 1,
            failedTaskAppAlert: '0',
            failedTaskEmailAlert: '',
            passedSchedulingTimeEmailAlert: '',
            passedSchedulingTimeAppAlert: '',
            passedZoneTimeAppAlert: '',
            passedZoneTimeEmailAlert: '',
            assignedAppAlert: '0',
            assignedEmailAlert: '',
            startEndProductAppAlert: '',
            startEndProductEmailAlert: '',
            clientUserGroupIsActive: 1,
            userGroupOrder: 1,
        })

    }

    private createDefaultAppSettings(clientId: number) {
        return this.clientAppSettingsModel.create({
            clientId,
            clientAppSettingSetupRange: 7,
            clientAppSettingDeviceRange: 7,
            clientAppSettingHumidityRange: 5,
            clientAppSettingTemperatureRange: 5,
            clientAppSettingZoneupdatePopuptime: 5,
            clientAppSettingPauseProduction: true,
            clientAppSettingPauseProductionUserId: 0,
            clientAppSettingTasksCsvInProgress: false,
            clientAppSettingTasksCsvInProgressUserId: 0,
            clientAppSettingTasksCsvMessage: null,
            clientAppSettingPartCsvInProgress: false,
            clientAppSettingPartCsvInProgressUserId: 0,
            clientAppSettingPartCsvMessage: null,
            allowOrdersInMultipleZones: true,
        });
    }

    private creatNewClient(email: string, name: string): Promise<ClientModel> {
        return this.clientModel.create({
            name,
            email,
            phone: '',
            address: 'ahmedabad',
            city: 'ahmedabad',
            state: 'gujarat',
            country: 'india',
            contactPerson: 'Dev user',
            status: true,
            isActive: true
        });

    }

    private async createNewUser(email: string, name: string, clientId: number, userGroupId: number): Promise<UserModel> {
        const newUser = this.userModel.create({
            firstName: name,
            lastName: 'Manager',
            email: '',
            username: email,
            password: '23cb2d3d426b10abdf03417cdb095f08',
            phoneNumber: '',
            profileImage: '',
            isActive: true,
            barcodeId: '',
        });
        const user = await newUser
        const userClientPivot = await this.userClientPivotModel.create({
            userId: user.id,
            clientId,
            userType: userType.MANAGER,
            isActive: 1,
            userGroupId
        });

        await this.userPermissionModel.create({
            clientUserPivotId: userClientPivot.id,
            isEditAllowed: false,
            editPermission: true,
        })

        await this.userConfigModel.create({
            clientUserPivotId: userClientPivot.id,
            defaultFeedViewId: 0,
            zoneLocationSetting: true,
            costPerHour: '',
            searchPreference: 'Order',
            searchPreferenceLiveScreen: 'Product',
            isProductionOrderNameDisplay: false,
            isSendToLiveOnceAllTaskDoneSetting: true,
            isSortProductsByEndDate: false,
            showTimeLeftInsteadOfZoneTime: false,
            actvUserAnalyticsSelectView: 0,
            collapseAllTaskGroups: false,
            isShowUsersTaggedInLiveScreen: false
        })

        return user;
    }
}
