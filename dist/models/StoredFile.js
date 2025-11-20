"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoredFile = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../db/sequelize");
class StoredFile extends sequelize_1.Model {
}
exports.StoredFile = StoredFile;
StoredFile.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: sequelize_1.DataTypes.STRING(191),
        allowNull: false
    },
    originalName: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    storedName: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    extension: {
        type: sequelize_1.DataTypes.STRING(32),
        allowNull: false
    },
    mimeType: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: false
    },
    size: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    }
}, {
    sequelize: sequelize_2.sequelize,
    tableName: 'files',
    timestamps: true,
    indexes: [
        {
            fields: ['userId']
        }
    ]
});
