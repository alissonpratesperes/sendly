export const ACCEPTED_CSV_CONFIG: Record<string, string[]> = {
    "text/csv": [".csv"],
    "application/csv": [".csv"],
    "application/vnd.ms-excel": [".csv"],
}
export const ACCEPTED_IMAGES_CONFIG: Record<string, string[]> = {
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "image/webp": [".webp"],
}
export const ALLOWED_IMAGE_EXTENSIONS = [
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
] as const;

export type AllowedImageExtension = typeof ALLOWED_IMAGE_EXTENSIONS[number];
