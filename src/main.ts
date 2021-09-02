import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json } from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // configure this before production
  app.useGlobalPipes(new ValidationPipe());
  app.use(json({ limit: '50mb' }));
  await app.listen(3000);
}
bootstrap();
