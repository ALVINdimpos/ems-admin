"use client";

import { Check } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

import { cn } from "@/lib/utils";

interface IColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  error?: string;
  presetColors?: string[];
  disabled?: boolean;
  className?: string;
}

const DEFAULT_PRESETS = [
  "#EF4444", // Red
  "#F97316", // Orange
  "#F59E0B", // Amber
  "#EAB308", // Yellow
  "#84CC16", // Lime
  "#22C55E", // Green
  "#10B981", // Emerald
  "#14B8A6", // Teal
  "#06B6D4", // Cyan
  "#0EA5E9", // Sky
  "#3B82F6", // Blue
  "#6366F1", // Indigo
  "#8B5CF6", // Violet
  "#A855F7", // Purple
  "#D946EF", // Fuchsia
  "#EC4899", // Pink
  "#F43F5E", // Rose
  "#64748B", // Slate
  "#1F2937", // Gray-800
  "#000000", // Black
];

export default function ColorPicker({
  value,
  onChange,
  label,
  error,
  presetColors = DEFAULT_PRESETS,
  disabled = false,
  className,
}: IColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync input value with prop value
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Validate hex color
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(newValue)) {
      onChange(newValue);
    }
  };

  const handlePresetClick = (color: string) => {
    setInputValue(color);
    onChange(color);
  };

  const handleNativePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value.toUpperCase();
    setInputValue(color);
    onChange(color);
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}

      {/* Color Preview & Input */}
      <div className="flex items-center gap-2">
        {/* Color Swatch Button */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            "relative h-10 w-10 rounded-lg border-2 border-gray-300 overflow-hidden",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          style={{ backgroundColor: value || "#FFFFFF" }}
          aria-label="Open color picker"
        >
          {/* Native color picker overlay */}
          <input
            type="color"
            value={value || "#FFFFFF"}
            onChange={handleNativePickerChange}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="Pick custom color"
          />
        </button>

        {/* Hex Input */}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          disabled={disabled}
          placeholder="#000000"
          className={cn(
            "flex-1 h-10 px-3 text-sm font-mono uppercase rounded-lg border",
            "focus:outline-none focus:ring-2 focus:ring-blue-500",
            error ? "border-red-500" : "border-gray-300",
            disabled && "opacity-50 cursor-not-allowed bg-gray-100"
          )}
          maxLength={7}
        />
      </div>

      {/* Preset Colors Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute z-50 mt-2 p-3 bg-white rounded-lg shadow-lg border border-gray-200 w-64">
          <p className="text-xs font-medium text-gray-500 mb-2">
            Preset Colors
          </p>
          <div className="grid grid-cols-5 gap-2">
            {presetColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handlePresetClick(color)}
                className={cn(
                  "h-8 w-8 rounded-md border-2 transition-transform hover:scale-110",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
                  value === color ? "border-blue-500" : "border-transparent"
                )}
                style={{ backgroundColor: color }}
                aria-label={`Select color ${color}`}
              >
                {value === color && (
                  <Check
                    className={cn(
                      "h-4 w-4 mx-auto",
                      isLightColor(color) ? "text-gray-800" : "text-white"
                    )}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

/**
 * Determine if a color is light (for contrast text)
 */
function isLightColor(color: string): boolean {
  const hex = color.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}
