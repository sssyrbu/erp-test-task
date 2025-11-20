"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoredFile = exports.Session = exports.User = exports.setupAssociations = void 0;
const Session_1 = require("./Session");
Object.defineProperty(exports, "Session", { enumerable: true, get: function () { return Session_1.Session; } });
const StoredFile_1 = require("./StoredFile");
Object.defineProperty(exports, "StoredFile", { enumerable: true, get: function () { return StoredFile_1.StoredFile; } });
const User_1 = require("./User");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return User_1.User; } });
let associationsReady = false;
const setupAssociations = () => {
    if (associationsReady) {
        return;
    }
    User_1.User.hasMany(Session_1.Session, {
        foreignKey: 'userId',
        as: 'sessions',
        onDelete: 'CASCADE'
    });
    Session_1.Session.belongsTo(User_1.User, {
        foreignKey: 'userId',
        as: 'user'
    });
    User_1.User.hasMany(StoredFile_1.StoredFile, {
        foreignKey: 'userId',
        as: 'files',
        onDelete: 'CASCADE'
    });
    StoredFile_1.StoredFile.belongsTo(User_1.User, {
        foreignKey: 'userId',
        as: 'user'
    });
    associationsReady = true;
};
exports.setupAssociations = setupAssociations;
