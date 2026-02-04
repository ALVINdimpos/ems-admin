"use client";

import { Upload, X, Image as ImageIcon, Film, Loader2 } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useMemo, useState, useRef } from "react";

import { cn } from "@/lib/utils";

interface IMediaUploadProps {
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // in MB
  maxFiles?: number;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  onUpload?: (files: File[]) => Promise<string[]>;
}

export default function MediaUpload({
  value,
  onChange,
  multiple = false,
  accept = "image/*,video/*",
  maxSize = 10,
  maxFiles = 5,
  placeholder = "Drop files here or click to upload",
  className,
  disabled = false,
  onUpload,
}: IMediaUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const urls = useMemo(
    () => (Array.isArray(value) ? value : value ? [value] : []),
    [value]
  );

  const validateFile = useCallback(
    (file: File): string | null => {
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > maxSize) {
        return `File "${file.name}" exceeds ${maxSize}MB limit`;
      }
      return null;
    },
    [maxSize]
  );

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      setError(null);
      const fileArray = Array.from(files);

      // Check max files limit
      if (multiple && urls.length + fileArray.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`);
        return;
      }

      // Validate each file
      for (const file of fileArray) {
        const validationError = validateFile(file);
        if (validationError) {
          setError(validationError);
          return;
        }
      }

      // Upload files
      if (onUpload) {
        setIsUploading(true);
        try {
          const uploadedUrls = await onUpload(fileArray);
          if (multiple) {
            onChange([...urls, ...uploadedUrls]);
          } else {
            onChange(uploadedUrls[0]);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "Upload failed");
        } finally {
          setIsUploading(false);
        }
      } else {
        // Preview mode - use object URLs
        const objectUrls = fileArray.map((file) => URL.createObjectURL(file));
        if (multiple) {
          onChange([...urls, ...objectUrls]);
        } else {
          onChange(objectUrls[0]);
        }
      }
    },
    [multiple, urls, maxFiles, validateFile, onUpload, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (!disabled && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [disabled, handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFiles(e.target.files);
      }
    },
    [handleFiles]
  );

  const removeUrl = useCallback(
    (index: number) => {
      const newUrls = urls.filter((_, i) => i !== index);
      if (multiple) {
        onChange(newUrls);
      } else {
        onChange("");
      }
    },
    [urls, multiple, onChange]
  );

  const isImage = (url: string) => {
    return (
      /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url) || url.startsWith("blob:")
    );
  };

  const isVideo = (url: string) => {
    return /\.(mp4|webm|ogg|mov)$/i.test(url);
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Upload Area */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer",
          isDragging && "border-blue-500 bg-blue-50",
          disabled && "opacity-50 cursor-not-allowed",
          !isDragging && !disabled && "border-gray-300 hover:border-gray-400"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          disabled={disabled}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center text-center">
          {isUploading ? (
            <>
              <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-2" />
              <p className="text-sm text-gray-600">Uploading...</p>
            </>
          ) : (
            <>
              <Upload className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">{placeholder}</p>
              <p className="text-xs text-gray-400 mt-1">
                Max {maxSize}MB per file
                {multiple && `, up to ${maxFiles} files`}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {/* Preview Grid */}
      {urls.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {urls.map((url, index) => (
            <div
              key={index}
              className="relative group aspect-video rounded-lg overflow-hidden bg-gray-100 border border-gray-200"
            >
              {isImage(url) ? (
                <Image
                  src={url}
                  alt={`Upload ${index + 1}`}
                  fill
                  className="object-cover"
                  unoptimized={url.startsWith("blob:")}
                />
              ) : isVideo(url) ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Film className="h-8 w-8 text-gray-400" />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
              )}

              {/* Remove Button */}
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeUrl(index);
                  }}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove file"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
