import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TerminusModule } from "@nestjs/terminus";
import { HttpModule } from "@nestjs/axios";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { DatabaseModule, KafkaConsumer, KafkaProducer } from "@app/config";
import { MailModule } from "@app/common";
import { ViewModule } from "./views/view.module";
import { ZoneModule } from "./zones/zone.module";
import { HealthController } from "./health.controller";
import { ProductTypeGroupModule } from "./productTypeGroups/productTypeGroup.module";
import { ProductTypeModule } from "./productTypes/productType.module";
import { TagGroupModule } from "./tagGroups/tagGroup.module";
import { TagModule } from "./tags/tag.module";
import { TaskGroupModule } from "./taskGroups/taskGroups.module";
import { PartsModule } from "./parts/parts.module";
import { PartGroupsModule } from "./partGroups/partGroups.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    DatabaseModule,
    MailModule,
    TerminusModule,
    HttpModule,
    ViewModule,
    ZoneModule,
    ProductTypeGroupModule,
    ProductTypeModule,
    TaskGroupModule,
    TagGroupModule,
    TagModule,
    PartGroupsModule,
    PartsModule,
  ],
  controllers: [HealthController],
  providers: [KafkaProducer.setClientId("management-microservice"), KafkaConsumer.setClientId("management-microservice")],
  exports: [DatabaseModule, MailModule, KafkaProducer, KafkaConsumer],
})
export class AppModule {}
