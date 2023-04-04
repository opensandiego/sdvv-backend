import { NestFactory } from '@nestjs/core';
import { StandaloneWorkerModule } from './standalone-worker.module';
import { ShutdownService } from './queue.dispatch/shutdown.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(
    StandaloneWorkerModule,
  );

  if (process.env.CI === 'true') {
    console.log('Running in CI context. Shutdown mode active.');
    app.get(ShutdownService).subscribeToShutdown(async () => {
      return await app.close();
    });
  }
}
bootstrap();
