"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const node_path_1 = __importDefault(require("node:path"));
const node_crypto_1 = __importDefault(require("node:crypto"));
const fileSystem_1 = require("../utils/fileSystem");
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        (0, fileSystem_1.ensureStorageDir)()
            .then((dir) => cb(null, dir))
            .catch((error) => cb(error, ''));
    },
    filename: (_req, file, cb) => {
        const uniqueName = `${node_crypto_1.default.randomUUID()}${node_path_1.default.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});
exports.upload = (0, multer_1.default)({ storage });
