import { Kafka } from 'kafkajs';

export class KafkaJS {
    private brokers: [string];

    constructor(broker : string) {
        this.brokers = [broker];
    }

    async kafkaClient (clientId:string) {
        return new Kafka({ clientId: clientId, brokers: this.brokers});
    }
}
