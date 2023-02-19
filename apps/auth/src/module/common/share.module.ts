import {Module} from "@nestjs/common";
import {DatabasesModule} from "./databases.module";
import {UtilsModule} from "./utils.module";
import {ModelCacheModule} from "./modelCache.module";


@Module({
    imports: [
        DatabasesModule,
        UtilsModule,
        ModelCacheModule
    ],
    exports: [DatabasesModule, UtilsModule,ModelCacheModule]
})
export class ShareModule {
}