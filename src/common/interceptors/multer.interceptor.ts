import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';

export const multerOptions = {
  storage: diskStorage({
    destination: './src/uploads',
    filename: (req, file, callback) => {
      const newFileName = `${Date.now()}-${file.originalname}`
      callback(null, newFileName);
    },
  }),

  fileFilter: (req, file, callback) => {
    if (file.mimetype.startsWith('image')) {
        callback(null, true);
    } else {
        callback(new BadRequestException('Chỉ được phép tải lên file hình ảnh'), false);
    }
  },

  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
};