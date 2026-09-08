import { extname } from 'path';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { NestInterceptor, BadRequestException, mixin, Type } from '@nestjs/common';

import { ALLOWED_IMAGE_MIME_TYPES, AllowedImageMimeType } from '../types/allowedImageMimeTypes.type';
import { ALLOWED_IMAGE_EXTENSIONS, AllowedImageExtension } from '../types/allowedImageExtensions.type';

export function TemplateImageInterceptor(): Type<NestInterceptor> {
  class MixinInterceptor extends FileInterceptor("file", {
    storage: diskStorage({
      destination: "./uploads",

      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);

        callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
    fileFilter: (req, file, callback) => {
      const fileExtension = extname(file.originalname).toLowerCase() as AllowedImageExtension;
      const fileMimeType = file.mimetype.toLowerCase() as AllowedImageMimeType;
      const isExtensionValid = ALLOWED_IMAGE_EXTENSIONS.includes(fileExtension);
      const isMimeValid = ALLOWED_IMAGE_MIME_TYPES.includes(fileMimeType) || fileMimeType.startsWith('image/');

      if (!isExtensionValid || !isMimeValid) {
        return callback(new BadRequestException("Only image file types (PNG, JPG, JPEG, WEBP) are allowed"), false);
      }

      callback(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  }) {}

  return mixin(MixinInterceptor);
}
