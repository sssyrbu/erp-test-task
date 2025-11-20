import multer from 'multer';
import path from 'node:path';
import crypto from 'node:crypto';
import { ensureStorageDir } from '../utils/fileSystem';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    ensureStorageDir()
      .then((dir) => cb(null, dir))
      .catch((error) => cb(error as Error, ''));
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${crypto.randomUUID()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

export const upload = multer({ storage });

