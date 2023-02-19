import {Module} from "@nestjs/common";
import {ShareModule} from "../common/share.module";
import {KafkaConsumer, KafkaProducer} from "@app/config";
import {TokenEmitterService} from "./token-emitter.service";
import {EventEmitterModule} from "@nestjs/event-emitter";
import {TokenController} from "./token.controller";
import {TokenService} from "./token.service";

@Module({
    imports: [
        ShareModule,
        EventEmitterModule.forRoot()
    ],
    controllers: [TokenController],
    providers: [
        KafkaConsumer.setClientId('auth-microservice'),
        KafkaProducer.setClientId('auth-microservice'),
        TokenEmitterService,
    ],
    exports:[]
})
export class TokenModule {

}