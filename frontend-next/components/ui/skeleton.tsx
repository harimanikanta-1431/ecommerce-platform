import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200",
        className,
      )}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm">
      <Skeleton className="aspect-square w-full" />
      <Skeleton className="mt-4 h-4 w-3/4" />
      <Skeleton className="mt-2 h-3 w-full" />
      <Skeleton className="mt-2 h-3 w-2/3" />
      <div className="mt-4 flex items-center justify-between">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="size-10" />
      </div>
    </div>
  );
}
