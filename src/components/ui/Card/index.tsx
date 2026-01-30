import React from "react";

interface ICardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  shadow?: boolean;
}

export default function Card({
  children,
  className = "",
  padding = "md",
  shadow = true,
}: ICardProps) {
  const paddingStyles = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <article
      className={`
        bg-white rounded-lg border border-gray-200
        ${shadow ? "shadow-lg" : ""}
        ${paddingStyles[padding]}
        ${className}
      `}
    >
      {children}
    </article>
  );
}
