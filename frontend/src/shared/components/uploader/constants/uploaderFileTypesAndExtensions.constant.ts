export const ACCEPTED_EXCEL_CONFIG: Record<string, string[]> = {
    "application/vnd.ms-excel": [".xls"],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
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
