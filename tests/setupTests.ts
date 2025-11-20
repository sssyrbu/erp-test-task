import fs from 'node:fs/promises';
import path from 'node:path';
import { sequelize } from '../src/db/sequelize';
import { setupAssociations } from '../src/models';
import { env } from '../src/config/env';

const storageDir = path.resolve(process.cwd(), env.fileStoragePath);

beforeAll(async () => {
  setupAssociations();
  await sequelize.sync({ force: true });
});

beforeEach(async () => {
  await sequelize.truncate({ cascade: true });
  await fs.rm(storageDir, { recursive: true, force: true });
  await fs.mkdir(storageDir, { recursive: true });
});

afterAll(async () => {
  await sequelize.close();
  await fs.rm(storageDir, { recursive: true, force: true });
});

