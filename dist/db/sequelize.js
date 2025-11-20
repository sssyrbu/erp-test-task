"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const env_1 = require("../config/env");
exports.sequelize = env_1.env.dbDialect === 'sqlite'
    ? new sequelize_1.Sequelize({
        dialect: 'sqlite',
        storage: env_1.env.dbStorage || ':memory:',
        logging: false
    })
    : new sequelize_1.Sequelize(env_1.env.dbName, env_1.env.dbUser, env_1.env.dbPassword, {
        host: env_1.env.dbHost,
        port: env_1.env.dbPort,
        dialect: env_1.env.dbDialect,
        logging: false
    });
