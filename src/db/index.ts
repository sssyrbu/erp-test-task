import { env } from '../config/env';
import { sequelize } from './sequelize';
import { setupAssociations } from '../models';

let initialized = false;

const init = () => {
  if (!initialized) {
    setupAssociations();
    initialized = true;
  }
};

export const initDatabaseIfNeeded = async () => {
  init();
  if (env.syncDbOnBoot) {
    await sequelize.sync({ alter: true });
  } else {
    await sequelize.authenticate();
  }
};

