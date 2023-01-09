import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ShutdownService } from './queue.dispatch/shutdown.service';
import { StandaloneWorkerModule } from './standalone-worker.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(
    StandaloneWorkerModule,
  );

  const config = app.get(ConfigService);
  const inTESTING_MODE = config.get('root.TESTING_MODE');

  if (inTESTING_MODE) {
    console.log(`Running in Testing Mode. Shutdown Detection: Enabled.`);

    app.enableShutdownHooks();

    app.get(ShutdownService).subscribeToShutdown(async () => {
      console.log('... Shutdown Request detected');
      console.log('Calling: app.close()');
      await app.close();

      console.log('Calling: process.exit(0)');
      process.exit(0);
    });
  }
}
bootstrap();
