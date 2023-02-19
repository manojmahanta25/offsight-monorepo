import {Module} from "@nestjs/common";
import {UserModelCache} from "../../model/user-model.cache";
import {CacheClass} from "../../model/common.cache";
import {UserGroupModelCache} from "../../model/usergroup-model.cache";
import {DatabasesModule} from "./databases.module";

@Module({
    imports:[
        DatabasesModule
    ],
    providers: [
        UserModelCache,
        UserGroupModelCache ,
        CacheClass],
    exports: [ UserModelCache,
        UserGroupModelCache,
        CacheClass]
})
export class ModelCacheModule{
}