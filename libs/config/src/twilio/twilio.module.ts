import {Module} from "@nestjs/common";
import {TwilioModule} from "nestjs-twilio";
import {ConfigModule, ConfigService} from "@nestjs/config";


@Module({
    imports: [
        TwilioModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => ({
                accountSid: config.get('TWILIO_ACCOUNT_SID') || 'AC9312b8c3cf6622335e7d4833c4b92d5b',
                authToken: config.get('TWILIO_AUTH_TOKEN') || '986b2f408bb90c0e5fc812460b56aa5f',
                verificationSID: config.get('VERIFICATION_SID')|| 'VA457a2ab708f24627a15c2a7a99df6e52',
            }),
            inject: [ConfigService],
        }),
    ],
    exports: [TwilioModule]
})
export class TwilioModuleConfig {
}