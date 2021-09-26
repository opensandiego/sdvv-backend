import { NestFactory } from '@nestjs/core';
import { StandaloneWorkerModule } from './standalone-worker.module';
import { StandaloneWorkerService } from './standalone-worker.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(
    StandaloneWorkerModule,
  );
  const tasksService = app.get(StandaloneWorkerService);
  console.log(await tasksService.getHello());
  // await app.close();
}
bootstrap();
