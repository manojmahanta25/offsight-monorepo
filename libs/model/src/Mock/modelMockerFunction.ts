import mockUserModel from "@app/model/Mock/User/user.mock";
import mockUserGroupModel from "@app/model/Mock/User/user-group.mock";
import mockUserAuthModel from "@app/model/Mock/User/user-auth.mock";
import mockClientModel from "@app/model/Mock/Client/cilent.mock";
import mockUserClientPivotModel from "@app/model/Mock/User/user-client-pivot.mock";
import mockClientAppSettingsModel from "@app/model/Mock/Client/client-app-settings.mock";
import mockUserPermissionModel from "@app/model/Mock/User/user-permission.mock";
import mockUserConfigModel from "@app/model/Mock/User/user-config.mock";
import mockProductTypeGroupModel from '@app/model/Mock/Management/product-type-group.mock'
export const ModelMockerFunction = (token)=>{
    if(token == 'UserModelRepository'){
        return mockUserModel;
    }
    if(token == 'UserGroupModelRepository'){
        return mockUserGroupModel;
    }
    if(token == 'UserAuthModelRepository'){
        return mockUserAuthModel;
    }

    if(token == 'ClientModelRepository'){
        return mockClientModel;
    }

    if(token == 'UserClientPivotModelRepository'){
        return mockUserClientPivotModel;
    }

    if(token == 'ClientAppSettingsModelRepository'){
        return mockClientAppSettingsModel;
    }

    if(token == 'UserPermissionModelRepository'){
        return mockUserPermissionModel;
    }

    if(token == 'UserConfigModelRepository'){
        return mockUserConfigModel;
    }

    if(token == 'ProductTypeGroupModelRepository') {
        return mockProductTypeGroupModel
    }
}