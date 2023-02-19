import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {DatabaseModule} from "@app/config";
import {SequelizeModule} from "@nestjs/sequelize";
import {ClientModel} from "@app/model/Client/client.model";
import {UserGroupModel} from "@app/model/User/user-group.model";
import {UserModel} from "@app/model/User/user.model";
import {UserAuthModel} from "@app/model/User/user-auth.model";
import {UserPermissionModel} from "@app/model/User/user-permission.model";
import {UserConfigModel} from '@app/model/User/user-config.model';
import {UserClientPivotModel} from "@app/model/User/user-client-pivot.model";
import {ClientAppSettingsModel} from "@app/model/Client/client-app-settings.model";
import {RedisService} from "../../service/redis/redis.service";
import {UserModelCache} from "../../model/user-model.cache";
import {CacheClass} from "../../model/common.cache";
import {UserGroupModelCache} from "../../model/usergroup-model.cache";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        DatabaseModule,
        SequelizeModule.forFeature([
            ClientModel,
            UserGroupModel,
            UserModel,
            UserClientPivotModel,
            ClientAppSettingsModel,
            UserAuthModel,
            UserPermissionModel,
            UserConfigModel
        ]),
    ],
    providers: [RedisService],
    exports: [ConfigModule,DatabaseModule,SequelizeModule]
})
export class DatabasesModule {
}