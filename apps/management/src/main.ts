import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, RequestMethod, VersioningType } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from "cookie-parser";


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const globalPrefix = 'api/management';    // added management as I need to check in nginx reverse proxy
  app.use(cookieParser());
  app.enableVersioning({
    defaultVersion: ['1'],
    type: VersioningType.URI,
  });

  app.setGlobalPrefix(globalPrefix,
    {
      exclude: [{ path: '/health', method: RequestMethod.GET }],  // comments as I need to check in nginx reverse proxy
    }
  );

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .addApiKey({ type: 'apiKey', name: 'x-authorisation', in: 'header' })
    .setTitle('Management')
    .setDescription('The Management APIs List')
    .setVersion('v1')
    .build();

  const port = process.env.MGT_PORT || 3101;

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(globalPrefix + '/api-list', app, document);

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );

}
bootstrap();
