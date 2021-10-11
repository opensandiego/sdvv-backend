import { NestFactory } from '@nestjs/core';
import { StandaloneWorkerModule } from './standalone-worker.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(
    StandaloneWorkerModule,
  );
}
bootstrap();
