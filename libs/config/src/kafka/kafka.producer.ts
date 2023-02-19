import { Injectable, OnApplicationShutdown} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Message, Producer, RecordMetadata} from "kafkajs";
import { KafkaJS } from "./kafka.config";

@Injectable()
export class KafkaProducer implements OnApplicationShutdown {
    private producer: Producer
    private static clientId: string

    constructor(private readonly configService: ConfigService) {
    }

    static setClientId(clientId: string) {
        this.clientId = clientId
        return this;
    }
   
    async getConnection(isTransaction:boolean,transactionalId) {
        if (isTransaction) {
            const kafka = await new KafkaJS(this.configService.get('KAFKA_BROKER')).kafkaClient(KafkaProducer.clientId)
            this.producer = await kafka.producer({
                idempotent: true,
                transactionalId,
                maxInFlightRequests: 1,
            })
        }else {
            const kafka = await new KafkaJS(this.configService.get('KAFKA_BROKER')).kafkaClient(KafkaProducer.clientId)
            this.producer = await kafka.producer()
        }
        return await this.producer.connect();
    }

    async sendMessage(topic: string, message: Message[],isTransaction:boolean=false,transactionalId=''):Promise<RecordMetadata[]> {
        try {
            await this.getConnection(isTransaction,transactionalId);
            return await this.producer.send({
                topic: topic,
                messages: message,
            })

        } catch (e) {
            return null
        }
    }

    disconnect() {
        if(typeof this.producer != 'undefined') {
            this.producer.disconnect().then(console.log).catch(console.log);
        }
    }

    onApplicationShutdown(signal?: string): any {
        this.disconnect();
    }
}