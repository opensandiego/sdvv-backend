import { NestFactory } from '@nestjs/core';
import { UpdateCommandModule } from './update-command.module';

async function bootstrap() {
  const app = await NestFactory.create(UpdateCommandModule);
  await app.listen(3000);
}
bootstrap();
