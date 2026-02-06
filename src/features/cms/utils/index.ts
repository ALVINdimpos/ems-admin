/**
 * CMS Utilities
 */

/**
 * Generate a URL-friendly slug from text
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Re-export chunked upload utilities
export {
  chunkFile,
  chunkFiles,
  buildContentFormData,
  fileToDataUri,
  type IFileChunk,
  type IChunkedFile,
  type IUploadProgress,
  type ProgressCallback,
} from "./chunkedUpload";
