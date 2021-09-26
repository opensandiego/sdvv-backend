import { NestFactory } from '@nestjs/core';
import { EFileStandaloneModule } from './efile-standalone.module';
import { EFileStandaloneService } from './efile-standalone.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(EFileStandaloneModule);
  const tasksService = app.get(EFileStandaloneService);
  console.log(await tasksService.getHello());
  // await app.close();
}
bootstrap();
