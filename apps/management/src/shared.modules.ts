import { Module } from "@nestjs/common";
import { DatabaseModule, KafkaConsumer, KafkaProducer } from '@app/config';
import { SharedService } from "./shared.service"
import { HttpModule } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { EventEmitterModule } from "@nestjs/event-emitter";

@Module({
    imports: [
        DatabaseModule,
        EventEmitterModule.forRoot(),
        HttpModule.register({ timeout: 5000, maxRedirects: 5})
    ],
    controllers: [],
    providers: [
        ConfigService,
        KafkaProducer.setClientId('management-microservice'), 
        KafkaConsumer.setClientId('management-microservice'),
        SharedService
    ],
    exports: [KafkaConsumer, KafkaProducer, SharedService, HttpModule]
})
export class ShareModule {}