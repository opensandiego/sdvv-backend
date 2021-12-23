import { BootstrapConsole } from 'nestjs-console';
import { CLIModule } from './cli/cli.module';

const bootstrap = new BootstrapConsole({
  module: CLIModule,
  useDecorators: true,
});

bootstrap.init().then(async (app) => {
  try {
    await app.init();
    await bootstrap.boot();
    await app.close();
  } catch (e) {
    console.error(e);
    await app.close();
    process.exit(1);
  }
});
