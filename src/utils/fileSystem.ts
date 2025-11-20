import fs from 'node:fs/promises';
import path from 'node:path';
import { env } from '../config/env';

export const ensureStorageDir = async () => {
  const dir = path.resolve(process.cwd(), env.fileStoragePath);
  await fs.mkdir(dir, { recursive: true });
  return dir;
};

export const resolveStoragePath = (filename: string) => path.resolve(process.cwd(), env.fileStoragePath, filename);

export const deleteIfExists = async (filePath: string) => {
  try {
    await fs.unlink(filePath);
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error;
    }
  }
};

