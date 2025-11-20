"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../db/sequelize");
class Session extends sequelize_1.Model {
}
exports.Session = Session;
Session.init({
    id: {
        type: sequelize_1.DataTypes.STRING(191),
        primaryKey: true
    },
    userId: {
        type: sequelize_1.DataTypes.STRING(191),
        allowNull: false
    },
    accessTokenHash: {
        type: sequelize_1.DataTypes.STRING(191),
        allowNull: false
    },
    refreshTokenHash: {
        type: sequelize_1.DataTypes.STRING(191),
        allowNull: false
    },
    accessExpiresAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    refreshExpiresAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    revokedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize: sequelize_2.sequelize,
    tableName: 'sessions',
    timestamps: true,
    indexes: [
        {
            fields: ['userId']
        },
        {
            fields: ['refreshExpiresAt']
        }
    ]
});
