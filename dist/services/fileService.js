"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFile = exports.deleteFile = exports.getFile = exports.listFiles = exports.createFile = void 0;
const node_path_1 = __importDefault(require("node:path"));
const HttpError_1 = require("../errors/HttpError");
const StoredFile_1 = require("../models/StoredFile");
const fileSystem_1 = require("../utils/fileSystem");
const normalizeFileExtension = (filename) => node_path_1.default.extname(filename).replace('.', '').toLowerCase();
const mapUploadToRecord = (userId, file) => ({
    userId,
    originalName: file.originalname,
    storedName: node_path_1.default.basename(file.filename ?? file.path),
    extension: normalizeFileExtension(file.originalname),
    mimeType: file.mimetype,
    size: file.size
});
const createFile = async (userId, file) => {
    if (!file) {
        throw new HttpError_1.BadRequestError('File is required');
    }
    return StoredFile_1.StoredFile.create(mapUploadToRecord(userId, file));
};
exports.createFile = createFile;
const listFiles = async (userId, page, listSize) => {
    const limit = Math.max(1, listSize);
    const offset = (Math.max(1, page) - 1) * limit;
    const { rows, count } = await StoredFile_1.StoredFile.findAndCountAll({
        where: { userId },
        limit,
        offset,
        order: [['createdAt', 'DESC']]
    });
    return {
        data: rows,
        meta: {
            total: count,
            page: Math.max(1, page),
            pageSize: limit,
            totalPages: Math.ceil(count / limit) || 1
        }
    };
};
exports.listFiles = listFiles;
const getFile = async (userId, id) => {
    const file = await StoredFile_1.StoredFile.findOne({
        where: { id, userId }
    });
    if (!file) {
        throw new HttpError_1.NotFoundError('File not found');
    }
    return file;
};
exports.getFile = getFile;
const deleteFile = async (userId, id) => {
    const file = await (0, exports.getFile)(userId, id);
    await file.destroy();
    await (0, fileSystem_1.deleteIfExists)((0, fileSystem_1.resolveStoragePath)(file.storedName));
};
exports.deleteFile = deleteFile;
const updateFile = async (userId, id, file) => {
    if (!file) {
        throw new HttpError_1.BadRequestError('File is required');
    }
    const existing = await (0, exports.getFile)(userId, id);
    const previousPath = (0, fileSystem_1.resolveStoragePath)(existing.storedName);
    await existing.update(mapUploadToRecord(userId, file));
    await existing.reload();
    await (0, fileSystem_1.deleteIfExists)(previousPath);
    return existing;
};
exports.updateFile = updateFile;
