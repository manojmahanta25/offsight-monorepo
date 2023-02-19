import {Module} from "@nestjs/common";
import {JwtService} from "../../service/jwt-service/jwt.service";
import {KeypairService} from "../../service/keypair/keypair.service";
import {SaltUtil} from "../../utils/salt/salt.util";
import {RedisService} from "../../service/redis/redis.service";
import {MailModule} from "@app/common";
import {TokenService} from "../token/token.service";
@Module({
    imports: [MailModule],
    providers: [
        JwtService,
        KeypairService,
        SaltUtil,
        RedisService,
        TokenService
    ],
    exports: [JwtService, KeypairService,SaltUtil,RedisService,MailModule,TokenService]
})
export class UtilsModule {
}