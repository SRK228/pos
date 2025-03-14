import React from "react";
import { cn } from "@/lib/utils";

interface PlaceholderImageProps {
  category?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function PlaceholderImage({
  category = "Toys",
  className,
  size = "md",
}: PlaceholderImageProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-full h-full",
    lg: "w-16 h-16",
  };

  const bgColor =
    category === "Toys"
      ? "bg-pink-100"
      : category === "Clothes"
        ? "bg-blue-100"
        : "bg-green-100";

  const textColor =
    category === "Toys"
      ? "text-pink-800"
      : category === "Clothes"
        ? "text-blue-800"
        : "text-green-800";

  const icon = category === "Toys" ? "T" : category === "Clothes" ? "C" : "E";

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-md overflow-hidden",
        bgColor,
        sizeClasses[size],
        className,
      )}
    >
      <span className={cn("font-bold text-2xl", textColor)}>{icon}</span>
    </div>
  );
}
