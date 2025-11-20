import path from 'node:path';
import { BadRequestError, NotFoundError } from '../errors/HttpError';
import { StoredFile } from '../models/StoredFile';
import { deleteIfExists, resolveStoragePath } from '../utils/fileSystem';

const normalizeFileExtension = (filename: string) => path.extname(filename).replace('.', '').toLowerCase();

const mapUploadToRecord = (userId: string, file: Express.Multer.File) => ({
  userId,
  originalName: file.originalname,
  storedName: path.basename(file.filename ?? file.path),
  extension: normalizeFileExtension(file.originalname),
  mimeType: file.mimetype,
  size: file.size
});

export const createFile = async (userId: string, file: Express.Multer.File) => {
  if (!file) {
    throw new BadRequestError('File is required');
  }

  return StoredFile.create(mapUploadToRecord(userId, file));
};

export const listFiles = async (userId: string, page: number, listSize: number) => {
  const limit = Math.max(1, listSize);
  const offset = (Math.max(1, page) - 1) * limit;

  const { rows, count } = await StoredFile.findAndCountAll({
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

export const getFile = async (userId: string, id: number) => {
  const file = await StoredFile.findOne({
    where: { id, userId }
  });

  if (!file) {
    throw new NotFoundError('File not found');
  }

  return file;
};

export const deleteFile = async (userId: string, id: number) => {
  const file = await getFile(userId, id);
  await file.destroy();
  await deleteIfExists(resolveStoragePath(file.storedName));
};

export const updateFile = async (userId: string, id: number, file: Express.Multer.File) => {
  if (!file) {
    throw new BadRequestError('File is required');
  }

  const existing = await getFile(userId, id);
  const previousPath = resolveStoragePath(existing.storedName);

  await existing.update(mapUploadToRecord(userId, file));
  await existing.reload();
  await deleteIfExists(previousPath);

  return existing;
};

