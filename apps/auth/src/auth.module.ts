import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {LoginModule} from "./module/login/login.module";
import {LogoutModule} from "./module/logout/logout.module";
import {TokenModule} from "./module/token/token.module";
import {ShareModule} from "./module/common/share.module";
import {UserGroupModule} from "./module/usergroup/usergroup.module";
import {ClientModule} from "./module/client/client.module";
import {UserModule} from "./module/user/user.module";
import { TwoFactorAuthModule } from './module/two-factor-auth/two-factor-auth.module';

@Module({
    imports: [ ShareModule,
        LoginModule,
        LogoutModule,
        ClientModule,
        TokenModule,
        UserGroupModule,
        UserModule,
        TwoFactorAuthModule
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}

