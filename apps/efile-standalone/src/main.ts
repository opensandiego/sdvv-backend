import { NestFactory } from '@nestjs/core';
import { EfileStandaloneModule } from './efile-standalone.module';

async function bootstrap() {
  const app = await NestFactory.create(EfileStandaloneModule);
  await app.listen(3000);
}
bootstrap();
