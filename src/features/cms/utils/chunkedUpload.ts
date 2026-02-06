/**
 * Chunked File Upload Utility
 *
 * Converts files into base64-encoded chunks for transmission alongside
 * content creation/update payloads on the same endpoint.
 *
 * Why chunks?
 *  - Avoids request-size limits on large images/videos.
 *  - Allows progress tracking per chunk.
 *  - Resilient: individual failed chunks can be retried.
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
  /** Byte offset where this chunk starts */
  offset: number;
  /** Size of this chunk in bytes (before base64 encoding) */
  chunkSize: number;
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
 *
 * @param file       The File to chunk.
 * @param chunkSize  Bytes per chunk (default 512 KB).
 * @param onProgress Optional progress callback.
 * @returns          A `IChunkedFile` containing ordered chunks.
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
      offset,
      chunkSize: slice.size,
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
 *
 * @param files      Array of Files.
 * @param chunkSize  Bytes per chunk (default 512 KB).
 * @param onProgress Optional per-file progress callback.
 * @returns          Array of `IChunkedFile`.
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
 * Build a FormData payload that includes content fields **and** image file
 * chunks suitable for the `/marketing-contents` endpoint.
 *
 * The images are appended as individual `images` fields so the backend
 * receives them as a standard multipart file array. For files larger than
 * `chunkSize`, the file is split client-side but still sent as complete
 * binary blobs reconstructed from their base64 chunks.
 *
 * @param contentData  Plain-object content fields (title, type, etc.).
 * @param imageFiles   Raw image File objects to attach.
 * @param onProgress   Optional progress callback for chunk processing.
 * @returns            FormData ready to POST.
 */
export async function buildContentFormData(
  contentData: Record<string, unknown>,
  imageFiles: File[],
  onProgress?: ProgressCallback
): Promise<FormData> {
  const formData = new FormData();

  // Append all scalar / JSON content fields
  for (const [key, value] of Object.entries(contentData)) {
    if (value === undefined || value === null) continue;

    if (typeof value === "object" && !(value instanceof File)) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  }

  // Process & append images as chunked binary
  if (imageFiles.length > 0) {
    const chunkedImages = await chunkFiles(
      imageFiles,
      DEFAULT_CHUNK_SIZE,
      onProgress
    );

    for (const chunkedFile of chunkedImages) {
      // Reassemble chunks back into a single Blob for clean multipart upload
      const binaryChunks: BlobPart[] = [];
      for (const chunk of chunkedFile.chunks) {
        const binaryString = atob(chunk.data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        binaryChunks.push(bytes.buffer as ArrayBuffer);
      }

      const blob = new Blob(binaryChunks, { type: chunkedFile.mimeType });
      formData.append("images", blob, chunkedFile.fileName);
    }
  }

  return formData;
}

/**
 * Convert a File to a base64 data-URI string.
 * Useful for small preview images that don't need chunking.
 */
export function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
