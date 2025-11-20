"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDatabaseIfNeeded = void 0;
const env_1 = require("../config/env");
const sequelize_1 = require("./sequelize");
const models_1 = require("../models");
let initialized = false;
const init = () => {
    if (!initialized) {
        (0, models_1.setupAssociations)();
        initialized = true;
    }
};
const initDatabaseIfNeeded = async () => {
    init();
    if (env_1.env.syncDbOnBoot) {
        await sequelize_1.sequelize.sync({ alter: true });
    }
    else {
        await sequelize_1.sequelize.authenticate();
    }
};
exports.initDatabaseIfNeeded = initDatabaseIfNeeded;
