import * as path from 'path';
import { memoryStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { NestInterceptor, BadRequestException, mixin, Type } from '@nestjs/common';

import { requireEnvironmentVariable } from 'src/common/utils/requireEnvironmentVariable.util';
import { ALLOWED_IMAGE_MIME_TYPES, AllowedImageMimeTypes } from '../../common/types/allowedImageMimeTypes.type';
import { ALLOWED_IMAGE_EXTENSIONS, AllowedImageExtensions } from '../../common/types/allowedImageExtensions.type';

export function TemplateImageInterceptor(): Type<NestInterceptor> {
  class MixinInterceptor extends FileInterceptor("image", {
    storage: memoryStorage(),

    fileFilter: (request, file, callback) => {
      const fileExtension = path.extname(file.originalname).toLowerCase() as AllowedImageExtensions;
      const fileMimeType = file.mimetype.toLowerCase() as AllowedImageMimeTypes;
      const isExtensionValid = ALLOWED_IMAGE_EXTENSIONS.includes(fileExtension);
      const isMimeValid = ALLOWED_IMAGE_MIME_TYPES.includes(fileMimeType);

      if (!isExtensionValid || !isMimeValid) {
        return callback(new BadRequestException("Only image file types (PNG, JPG, JPEG, WEBP) are allowed"), false);
      }

      callback(null, true);
    },

    limits: {
      fileSize: Number(requireEnvironmentVariable("MAX_IMAGE_SIZE")),
    },
  }) {}

  return mixin(MixinInterceptor);
}
