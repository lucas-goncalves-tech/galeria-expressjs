import multer from 'multer';

const multerInstance = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const uploadMiddleware = multerInstance.single('image_file');
