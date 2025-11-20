"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("../db/sequelize");
const models_1 = require("../models");
const run = async () => {
    try {
        (0, models_1.setupAssociations)();
        await sequelize_1.sequelize.sync({ alter: true });
        // eslint-disable-next-line no-console
        console.log('Database synced successfully');
        process.exit(0);
    }
    catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to sync database', error);
        process.exit(1);
    }
};
void run();
