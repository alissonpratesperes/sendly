export const ALLOWED_IMAGE_EXTENSIONS = [
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
] as const;

export type AllowedImageExtensions = typeof ALLOWED_IMAGE_EXTENSIONS[number];
