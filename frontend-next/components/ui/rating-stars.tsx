import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type RatingStarsProps = {
  rating: number;
  count?: number;
  compact?: boolean;
  className?: string;
};

export function RatingStars({
  rating,
  count,
  compact = false,
  className,
}: RatingStarsProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, index) => {
          const filled = index + 1 <= Math.round(rating);

          return (
            <Star
              key={index}
              className={cn(
                compact ? "size-3.5" : "size-4",
                filled ? "text-amber-400" : "text-zinc-300",
              )}
              fill={filled ? "currentColor" : "none"}
              strokeWidth={filled ? 0 : 2}
            />
          );
        })}
      </div>
      <span
        className={cn(
          "font-semibold text-zinc-800",
          compact ? "text-xs" : "text-sm",
        )}
      >
        {rating.toFixed(1)}
      </span>
      {typeof count === "number" ? (
        <span
          className={compact ? "text-xs text-zinc-500" : "text-sm text-zinc-500"}
        >
          ({count.toLocaleString()})
        </span>
      ) : null}
    </div>
  );
}
