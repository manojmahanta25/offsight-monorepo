import {Module} from "@nestjs/common";
import {LogoutController} from "./logout.controller";
import {AuthGuard} from "../../middleware/authguard";
import {LogoutService} from "./logout.service";
import {ShareModule} from "../common/share.module";

@Module({
    imports: [ ShareModule ],
    controllers: [LogoutController],
    providers: [AuthGuard, LogoutService],
    exports: []
})
export class LogoutModule {
}