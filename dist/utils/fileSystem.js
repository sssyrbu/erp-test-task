"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteIfExists = exports.resolveStoragePath = exports.ensureStorageDir = void 0;
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const env_1 = require("../config/env");
const ensureStorageDir = async () => {
    const dir = node_path_1.default.resolve(process.cwd(), env_1.env.fileStoragePath);
    await promises_1.default.mkdir(dir, { recursive: true });
    return dir;
};
exports.ensureStorageDir = ensureStorageDir;
const resolveStoragePath = (filename) => node_path_1.default.resolve(process.cwd(), env_1.env.fileStoragePath, filename);
exports.resolveStoragePath = resolveStoragePath;
const deleteIfExists = async (filePath) => {
    try {
        await promises_1.default.unlink(filePath);
    }
    catch (error) {
        if (error.code !== 'ENOENT') {
            throw error;
        }
    }
};
exports.deleteIfExists = deleteIfExists;
