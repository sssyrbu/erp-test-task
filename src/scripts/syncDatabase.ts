import { sequelize } from '../db/sequelize';
import { setupAssociations } from '../models';

const run = async () => {
  try {
    setupAssociations();
    await sequelize.sync({ alter: true });
    // eslint-disable-next-line no-console
    console.log('Database synced successfully');
    process.exit(0);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to sync database', error);
    process.exit(1);
  }
};

void run();

