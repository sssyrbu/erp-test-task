"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceFile = exports.downloadFile = exports.deleteFileHandler = exports.getFileDetails = exports.listUserFiles = exports.uploadFile = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const fileService_1 = require("../services/fileService");
const fileSystem_1 = require("../utils/fileSystem");
const HttpError_1 = require("../errors/HttpError");
const parseFileId = (value) => {
    const id = Number(value);
    if (!Number.isInteger(id) || id <= 0) {
        throw new HttpError_1.BadRequestError('Invalid file id');
    }
    return id;
};
exports.uploadFile = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { userId } = req.auth;
    const file = await (0, fileService_1.createFile)(userId, req.file);
    res.status(201).json(file);
});
exports.listUserFiles = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { userId } = req.auth;
    const page = Number(req.query.page ?? 1) || 1;
    const listSize = Number(req.query.list_size ?? 10) || 10;
    const data = await (0, fileService_1.listFiles)(userId, page, listSize);
    res.json(data);
});
exports.getFileDetails = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { userId } = req.auth;
    const fileId = parseFileId(req.params.id);
    const file = await (0, fileService_1.getFile)(userId, fileId);
    res.json(file);
});
exports.deleteFileHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { userId } = req.auth;
    const fileId = parseFileId(req.params.id);
    await (0, fileService_1.deleteFile)(userId, fileId);
    res.status(204).send();
});
exports.downloadFile = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { userId } = req.auth;
    const fileId = parseFileId(req.params.id);
    const file = await (0, fileService_1.getFile)(userId, fileId);
    res.download((0, fileSystem_1.resolveStoragePath)(file.storedName), file.originalName);
});
exports.replaceFile = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { userId } = req.auth;
    const fileId = parseFileId(req.params.id);
    const file = await (0, fileService_1.updateFile)(userId, fileId, req.file);
    res.json(file);
});
