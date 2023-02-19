import { Injectable, OnApplicationShutdown} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Consumer} from "kafkajs";
import { KafkaJS } from "./kafka.config";
import { EventEmitter2 } from "@nestjs/event-emitter";

@Injectable()
export class KafkaConsumer implements OnApplicationShutdown{
    private consumer: Consumer
    private static clientId: string

    constructor(
        private eventEmitter: EventEmitter2,
        private readonly configService: ConfigService,      
    ) {
    }

    static setClientId(clientId: string) {
        this.clientId = clientId
        return this;
    }

    async getConnection(groupId) {
        const kafka = await new KafkaJS(this.configService.get('KAFKA_BROKER')).kafkaClient(KafkaConsumer.clientId);
        this.consumer = await kafka.consumer({groupId: groupId});
        await this.consumer.connect()
        return this.consumer;
    }

    disconnect() {
        this.consumer.disconnect().then(console.log).catch(console.log);
    }

    async parseDecodedToken(groupId: string) {
        await this.getConnection(groupId)
        await this.consumer.subscribe({topic: 'decode-token-topic'})
        await this.consumer.run({
            autoCommit: false,
            eachMessage: async ({topic, partition, message}) => {
                this.eventEmitter.emit(`token-${message.key.toString()}`, message.value.toString())
                await this.consumer.commitOffsets([{topic: topic, partition: partition, offset: message.offset}])
            },
        })
    }

    onApplicationShutdown(signal?: string): any {
        this.disconnect()
    }
}