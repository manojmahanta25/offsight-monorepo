import { Injectable, Inject } from '@nestjs/common';
import { KafkaConsumer } from '@app/config';

@Injectable()
export class SharedService {
  constructor(private kafkaConsumer: KafkaConsumer,) {
    this.kafkaConsumer.parseDecodedToken('management-group');
  }
}