import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-950 shadow-sm outline-none transition placeholder:text-zinc-400",
        "focus:border-zinc-400 focus:ring-4 focus:ring-amber-100",
        className,
      )}
      {...props}
    />
  );
}

export function Select({
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-800 shadow-sm outline-none transition",
        "focus:border-zinc-400 focus:ring-4 focus:ring-amber-100",
        className,
      )}
      {...props}
    />
  );
}
