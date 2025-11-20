import app from './app';
import { env } from './config/env';
import { initDatabaseIfNeeded } from './db';

const start = async () => {
  await initDatabaseIfNeeded();

  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on port ${env.port}`);
  });
};

void start();

