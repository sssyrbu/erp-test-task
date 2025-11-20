import { Sequelize } from 'sequelize';
import { env } from '../config/env';

export const sequelize =
  env.dbDialect === 'sqlite'
    ? new Sequelize({
        dialect: 'sqlite',
        storage: env.dbStorage || ':memory:',
        logging: false
      })
    : new Sequelize(env.dbName, env.dbUser, env.dbPassword, {
        host: env.dbHost,
        port: env.dbPort,
        dialect: 'mysql',
        logging: false
      });

