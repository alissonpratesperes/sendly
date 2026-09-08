export const ALLOWED_IMAGE_EXTENSIONS = [
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
] as const;

export type AllowedImageExtension = typeof ALLOWED_IMAGE_EXTENSIONS[number];
