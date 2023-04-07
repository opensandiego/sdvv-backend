import { NestFactory } from '@nestjs/core';
import { UpdateCommandModule } from './update-command.module';
import { UpdateCommandService } from './update-command.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(UpdateCommandModule);
  const myService = app.get(UpdateCommandService);
  await myService.runCommand();

  await app.close();
}
bootstrap();
