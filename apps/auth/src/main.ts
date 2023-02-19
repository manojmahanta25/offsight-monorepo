import { NestFactory } from "@nestjs/core";
import { AuthModule } from "./auth.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { Logger, ValidationPipe, VersioningType } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import { HeadersEnum } from "@app/common/enums/headers.enum";
async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  const globalPrefix = "api/auth";

  app.enableCors({
    credentials: true,
    origin: ["http://localhost:3001", "http://localhost:9000", "http://localhost:3000"],
  });
  app.enableShutdownHooks();
  app.use(cookieParser());
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe());
  app.enableVersioning({
    defaultVersion: ["1"],
    type: VersioningType.URI,
  });

  const config = new DocumentBuilder()
    .addApiKey({ type: "apiKey", name: "x-authorisation", in: "header" })
    .addCookieAuth(HeadersEnum.AUTH_TOKEN)
    .setTitle("Authentication & User API")
    .setDescription("list of all end points")
    .setVersion("v1")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(globalPrefix + "/api-list", app, document);

  const port = process.env.PORT || process.env.AUTH_PORT || 3000;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}
bootstrap();
