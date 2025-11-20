import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { createFile, deleteFile, getFile, listFiles, updateFile } from '../services/fileService';
import { resolveStoragePath } from '../utils/fileSystem';
import { BadRequestError } from '../errors/HttpError';

const parseFileId = (value: string) => {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new BadRequestError('Invalid file id');
  }
  return id;
};

export const uploadFile = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.auth!;
  const file = await createFile(userId, req.file as Express.Multer.File);
  res.status(201).json(file);
});

export const listUserFiles = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.auth!;
  const page = Number(req.query.page ?? 1) || 1;
  const listSize = Number(req.query.list_size ?? 10) || 10;
  const data = await listFiles(userId, page, listSize);
  res.json(data);
});

export const getFileDetails = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.auth!;
  const fileId = parseFileId(req.params.id);
  const file = await getFile(userId, fileId);
  res.json(file);
});

export const deleteFileHandler = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.auth!;
  const fileId = parseFileId(req.params.id);
  await deleteFile(userId, fileId);
  res.status(204).send();
});

export const downloadFile = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.auth!;
  const fileId = parseFileId(req.params.id);
  const file = await getFile(userId, fileId);
  res.download(resolveStoragePath(file.storedName), file.originalName);
});

export const replaceFile = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.auth!;
  const fileId = parseFileId(req.params.id);
  const file = await updateFile(userId, fileId, req.file as Express.Multer.File);
  res.json(file);
});

