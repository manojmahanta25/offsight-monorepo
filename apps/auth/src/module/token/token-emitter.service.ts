import { Injectable} from "@nestjs/common";
import { KafkaConsumer, KafkaProducer} from "@app/config";
import {TokenService} from "./token.service";
// import { ConsumerService } from '@app/common';

@Injectable()
export class TokenEmitterService {
    groupId = 'auth-group';
    consumeTopic = 'token-topic';
    producerTopic = 'decode-token-topic';

    constructor(
        private kafkaConsumer: KafkaConsumer, 
        private kafkaProducer: KafkaProducer, 
        private tokenService: TokenService
    ) {
        this.fetchToken().then(console.log).catch(console.log)
    }

    async fetchToken() {
        const consumer = await this.kafkaConsumer.getConnection(this.groupId)
        await consumer.subscribe({topic: this.consumeTopic})
        await consumer.run({
            autoCommit: false,
            eachMessage: async ({topic, partition, message}) => {

                const token = message.value.toString();
                const messageId = message.key.toString();
                const decodeToken = await this.tokenService.decodeToken(token);
                if (decodeToken) {
                    const valuePayload = {
                        message: 'success',
                        data: decodeToken,
                        status: 200
                    }
                    await this.kafkaProducer.sendMessage(this.producerTopic, [{
                        value: JSON.stringify(valuePayload),
                        key: messageId
                    }])
                } else {
                    const valuePayload = {
                        message: 'fail',
                        data: null,
                        status: 401
                    }
                    await this.kafkaProducer.sendMessage(this.producerTopic, [{
                        value: JSON.stringify(valuePayload),
                        key: messageId
                    }],true,'auth-topic-transaction')
                }
                await consumer.commitOffsets([{topic: topic, partition: partition, offset: message.offset}])
            },
        })
    }

}