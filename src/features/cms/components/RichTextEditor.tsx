"use client";

import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Link,
  Image,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  Undo,
  Redo,
} from "lucide-react";
import React, { useCallback, useState, useRef, useEffect } from "react";

import { cn } from "@/lib/utils";

interface IRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  maxHeight?: number;
  disabled?: boolean;
  error?: string;
  label?: string;
  className?: string;
}

interface IToolbarButton {
  icon: React.ReactNode;
  command: string;
  value?: string;
  title: string;
}

const TOOLBAR_GROUPS: IToolbarButton[][] = [
  [
    { icon: <Undo className="h-4 w-4" />, command: "undo", title: "Undo" },
    { icon: <Redo className="h-4 w-4" />, command: "redo", title: "Redo" },
  ],
  [
    {
      icon: <Heading1 className="h-4 w-4" />,
      command: "formatBlock",
      value: "h1",
      title: "Heading 1",
    },
    {
      icon: <Heading2 className="h-4 w-4" />,
      command: "formatBlock",
      value: "h2",
      title: "Heading 2",
    },
    {
      icon: <Heading3 className="h-4 w-4" />,
      command: "formatBlock",
      value: "h3",
      title: "Heading 3",
    },
  ],
  [
    { icon: <Bold className="h-4 w-4" />, command: "bold", title: "Bold" },
    {
      icon: <Italic className="h-4 w-4" />,
      command: "italic",
      title: "Italic",
    },
    {
      icon: <Underline className="h-4 w-4" />,
      command: "underline",
      title: "Underline",
    },
    {
      icon: <Strikethrough className="h-4 w-4" />,
      command: "strikeThrough",
      title: "Strikethrough",
    },
  ],
  [
    {
      icon: <AlignLeft className="h-4 w-4" />,
      command: "justifyLeft",
      title: "Align Left",
    },
    {
      icon: <AlignCenter className="h-4 w-4" />,
      command: "justifyCenter",
      title: "Align Center",
    },
    {
      icon: <AlignRight className="h-4 w-4" />,
      command: "justifyRight",
      title: "Align Right",
    },
  ],
  [
    {
      icon: <List className="h-4 w-4" />,
      command: "insertUnorderedList",
      title: "Bullet List",
    },
    {
      icon: <ListOrdered className="h-4 w-4" />,
      command: "insertOrderedList",
      title: "Numbered List",
    },
  ],
  [
    {
      icon: <Quote className="h-4 w-4" />,
      command: "formatBlock",
      value: "blockquote",
      title: "Quote",
    },
    {
      icon: <Code className="h-4 w-4" />,
      command: "formatBlock",
      value: "pre",
      title: "Code Block",
    },
  ],
  [
    {
      icon: <Link className="h-4 w-4" />,
      command: "createLink",
      title: "Insert Link",
    },
    {
      icon: <Image className="h-4 w-4" />,
      command: "insertImage",
      title: "Insert Image",
    },
  ],
];

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing...",
  minHeight = 200,
  maxHeight = 500,
  disabled = false,
  error,
  label,
  className,
}: IRichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Initialize content
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const execCommand = useCallback(
    (command: string, value?: string) => {
      if (disabled) return;

      // Focus the editor first
      editorRef.current?.focus();

      if (command === "createLink") {
        const url = prompt("Enter the URL:");
        if (url) {
          document.execCommand(command, false, url);
        }
      } else if (command === "insertImage") {
        const url = prompt("Enter the image URL:");
        if (url) {
          document.execCommand(command, false, url);
        }
      } else if (command === "formatBlock" && value) {
        document.execCommand(command, false, `<${value}>`);
      } else {
        document.execCommand(command, false, value);
      }

      handleInput();
    },
    [disabled, handleInput]
  );

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  }, []);

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}

      <div
        className={cn(
          "border rounded-lg overflow-hidden transition-colors",
          isFocused && "ring-2 ring-blue-500",
          error ? "border-red-500" : "border-gray-300",
          disabled && "opacity-50"
        )}
      >
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
          {TOOLBAR_GROUPS.map((group, groupIndex) => (
            <React.Fragment key={groupIndex}>
              <div className="flex items-center gap-0.5">
                {group.map((button, buttonIndex) => (
                  <button
                    key={buttonIndex}
                    type="button"
                    onClick={() => execCommand(button.command, button.value)}
                    disabled={disabled}
                    title={button.title}
                    className={cn(
                      "p-1.5 rounded hover:bg-gray-200 transition-colors",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500",
                      disabled && "cursor-not-allowed"
                    )}
                    aria-label={button.title}
                  >
                    {button.icon}
                  </button>
                ))}
              </div>
              {groupIndex < TOOLBAR_GROUPS.length - 1 && (
                <div className="w-px h-6 bg-gray-300 mx-1" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Editor */}
        <div
          ref={editorRef}
          contentEditable={!disabled}
          onInput={handleInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onPaste={handlePaste}
          data-placeholder={placeholder}
          className={cn(
            "p-4 overflow-y-auto focus:outline-none",
            "prose prose-sm max-w-none",
            "[&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-gray-400",
            disabled && "cursor-not-allowed bg-gray-50"
          )}
          style={{
            minHeight: `${minHeight}px`,
            maxHeight: `${maxHeight}px`,
          }}
          role="textbox"
          aria-multiline="true"
          aria-label={label || "Rich text editor"}
        />
      </div>

      {/* Error Message */}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

