import { NestFactory } from '@nestjs/core';
import { EfileStandaloneModule } from './efile-standalone.module';
import { EfileStandaloneService } from './efile-standalone.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(EfileStandaloneModule);
  const tasksService = app.get(EfileStandaloneService);
  console.log(tasksService.getHello());
}
bootstrap();
