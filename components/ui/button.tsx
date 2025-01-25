import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

export default function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "rounded-lg font-semibold transition-colors",
        {
          "bg-primary-600 text-white hover:bg-primary-700":
            variant === "primary",
          "bg-white text-primary-600 border border-primary-200 hover:bg-primary-50":
            variant === "outline",
          "text-secondary-600 hover:text-primary-600": variant === "secondary",
        },
        {
          "px-4 py-2 text-sm": size === "sm",
          "px-6 py-3": size === "md",
          "px-8 py-4": size === "lg",
        },
        className
      )}
      {...props}
    />
  );
}
