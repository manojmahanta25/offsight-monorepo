import { Module } from '@nestjs/common';
import { TwoFactorAuthService } from './two-factor-auth.service';
import {TwoFactorAuthController} from "./two-factor-auth.controller";
import {ShareModule} from "../common/share.module";
import {TwilioModuleConfig} from "@app/config";
import {LoginService} from "../login/login.service";
import {QrCodeUtil} from "../../utils/qrcode/qr-code.util";


@Module({
  imports: [
     ShareModule,
     TwilioModuleConfig
  ],
    controllers: [TwoFactorAuthController],
  providers: [TwoFactorAuthService,LoginService, QrCodeUtil],
})
export class TwoFactorAuthModule {}
