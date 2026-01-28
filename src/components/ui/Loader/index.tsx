import { Loader as LoaderIcon } from "lucide-react";

interface ILoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export default function Loader({
  size = "md",
  className = "",
  text,
}: ILoaderProps) {
  const sizeStyles = {
    sm: "h-6 w-6",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <section
      className={`flex flex-col items-center justify-center ${className}`}
      role="status"
      aria-live="polite"
    >
      <LoaderIcon
        className={`animate-spin text-blue-600 ${sizeStyles[size]}`}
      />
      {text && <p className="mt-2 text-sm text-gray-600">{text}</p>}
      <span className="sr-only">Loading...</span>
    </section>
  );
}
