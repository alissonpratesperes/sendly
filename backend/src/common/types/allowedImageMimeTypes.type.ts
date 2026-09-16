export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/octet-stream",
] as const;

export type AllowedImageMimeType = typeof ALLOWED_IMAGE_MIME_TYPES[number];
