import { NestFactory } from '@nestjs/core';
import { MigrationModule } from './migration.module';

async function bootstrap() {
  const app = await NestFactory.create(MigrationModule);
  await app.listen(3000);
}
bootstrap();
