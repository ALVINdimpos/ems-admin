/**
 * Chunked File Upload Utility
 *
 * Converts image files into base64-encoded chunks and sends them as part of
 * the JSON payload to the `/marketing-contents` endpoint — no separate media
 * endpoint is needed.
 *
 * Flow:
 *  1. Each file is sliced into ≤ 512 KB binary chunks.
 *  2. Each chunk is base64-encoded.
 *  3. The chunks array is attached to the content JSON body under `imageChunks`.
 *  4. The backend reassembles the chunks into the final image.
 */

/** Default chunk size: 512 KB */
const DEFAULT_CHUNK_SIZE = 512 * 1024;

/** Maximum recommended file size: 10 MB */
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// ============================================================================
// Types
// ============================================================================

export interface IFileChunk {
  /** Zero-based chunk index */
  index: number;
  /** Total number of chunks for this file */
  totalChunks: number;
  /** Base64-encoded chunk data */
  data: string;
  /** Original file name */
  fileName: string;
  /** MIME type of the original file */
  mimeType: string;
  /** Total file size in bytes */
  fileSize: number;
}

export interface IChunkedFile {
  /** Original file name */
  fileName: string;
  /** MIME type */
  mimeType: string;
  /** Total size in bytes */
  fileSize: number;
  /** Ordered array of base64 chunks */
  chunks: IFileChunk[];
}

export interface IUploadProgress {
  /** File currently being processed */
  fileName: string;
  /** Current chunk index (0-based) */
  currentChunk: number;
  /** Total chunks for this file */
  totalChunks: number;
  /** Overall progress percentage (0–100) */
  percent: number;
}

export type ProgressCallback = (progress: IUploadProgress) => void;

// ============================================================================
// Core helpers
// ============================================================================

/**
 * Read a Blob/File slice as a base64 string (without the data-URI prefix).
 */
function readBlobAsBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip the "data:…;base64," prefix
      const base64 = result.split(",")[1] ?? "";
      resolve(base64);
    };
    reader.onerror = () => reject(new Error("Failed to read file chunk"));
    reader.readAsDataURL(blob);
  });
}

/**
 * Validate a file before processing.
 */
function validateFile(file: File, maxSize = MAX_FILE_SIZE): void {
  if (file.size === 0) {
    throw new Error(`File "${file.name}" is empty`);
  }
  if (file.size > maxSize) {
    const maxMB = (maxSize / (1024 * 1024)).toFixed(1);
    const fileMB = (file.size / (1024 * 1024)).toFixed(1);
    throw new Error(
      `File "${file.name}" (${fileMB} MB) exceeds the ${maxMB} MB limit`
    );
  }
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Split a single File into base64-encoded chunks.
 */
export async function chunkFile(
  file: File,
  chunkSize = DEFAULT_CHUNK_SIZE,
  onProgress?: ProgressCallback
): Promise<IChunkedFile> {
  validateFile(file);

  const totalChunks = Math.ceil(file.size / chunkSize);
  const chunks: IFileChunk[] = [];

  for (let i = 0; i < totalChunks; i++) {
    const offset = i * chunkSize;
    const slice = file.slice(offset, offset + chunkSize);
    const data = await readBlobAsBase64(slice);

    chunks.push({
      index: i,
      totalChunks,
      data,
      fileName: file.name,
      mimeType: file.type || "application/octet-stream",
      fileSize: file.size,
    });

    onProgress?.({
      fileName: file.name,
      currentChunk: i + 1,
      totalChunks,
      percent: Math.round(((i + 1) / totalChunks) * 100),
    });
  }

  return {
    fileName: file.name,
    mimeType: file.type || "application/octet-stream",
    fileSize: file.size,
    chunks,
  };
}

/**
 * Process multiple files into chunked representations.
 */
export async function chunkFiles(
  files: File[],
  chunkSize = DEFAULT_CHUNK_SIZE,
  onProgress?: ProgressCallback
): Promise<IChunkedFile[]> {
  const results: IChunkedFile[] = [];

  for (const file of files) {
    const chunked = await chunkFile(file, chunkSize, onProgress);
    results.push(chunked);
  }

  return results;
}

/**
 * Convert image files to base64 chunk payloads ready to embed in a JSON body.
 *
 * Returns an array of objects, one per file, with the file's chunks.
 * This can be sent as `imageChunks` inside the content creation JSON.
 */
export async function prepareImageChunks(
  imageFiles: File[],
  onProgress?: ProgressCallback
): Promise<IChunkedFile[]> {
  return chunkFiles(imageFiles, DEFAULT_CHUNK_SIZE, onProgress);
}

/**
 * Convert a File to a full base64 data-URI string.
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

/**
 * Convert a File to a plain base64 string (no data-URI prefix).
 */
export async function fileToRawBase64(file: File): Promise<string> {
  const dataUri = await fileToBase64(file);
  return dataUri.split(",")[1] ?? "";
}
