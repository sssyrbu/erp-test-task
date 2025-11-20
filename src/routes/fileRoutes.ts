import { Router } from 'express';
import {
  deleteFileHandler,
  downloadFile,
  getFileDetails,
  listUserFiles,
  replaceFile,
  uploadFile
} from '../controllers/fileController';
import { requireAuth } from '../middleware/authMiddleware';
import { upload } from '../middleware/upload';

export const fileRouter = Router();

fileRouter.use(requireAuth);
fileRouter.post('/upload', upload.single('file'), uploadFile);
fileRouter.get('/list', listUserFiles);
fileRouter.get('/download/:id', downloadFile);
fileRouter.get('/:id', getFileDetails);
fileRouter.delete('/delete/:id', deleteFileHandler);
fileRouter.put('/update/:id', upload.single('file'), replaceFile);

