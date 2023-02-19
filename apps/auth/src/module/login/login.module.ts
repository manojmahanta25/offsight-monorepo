import {Module} from "@nestjs/common";
import {LoginService} from "./login.service";
import {LoginController} from "./login.controller";
import {ShareModule} from "../common/share.module";

@Module({
    imports: [ShareModule],
    controllers: [LoginController],
    providers: [LoginService],
})
export class LoginModule {
}