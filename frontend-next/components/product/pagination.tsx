import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type PaginationProps = {
  page: number;
  pages: number;
  baseParams: URLSearchParams;
};

function pageHref(page: number, baseParams: URLSearchParams) {
  const params = new URLSearchParams(baseParams);
  params.set("page", String(page));

  return `/products?${params.toString()}`;
}

export function Pagination({ page, pages, baseParams }: PaginationProps) {
  if (pages <= 1) {
    return null;
  }

  return (
    <nav className="mt-8 flex items-center justify-center gap-2">
      <Link
        aria-disabled={page === 1}
        href={pageHref(Math.max(page - 1, 1), baseParams)}
        className={cn(
          "inline-flex size-10 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 transition hover:bg-zinc-50",
          page === 1 && "pointer-events-none opacity-45",
        )}
      >
        <ChevronLeft className="size-4" />
      </Link>
      {Array.from({ length: pages }).map((_, index) => {
        const pageNumber = index + 1;
        const active = pageNumber === page;

        return (
          <Link
            key={pageNumber}
            href={pageHref(pageNumber, baseParams)}
            className={cn(
              "inline-flex size-10 items-center justify-center rounded-lg border text-sm font-black transition",
              active
                ? "border-zinc-950 bg-zinc-950 text-white"
                : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50",
            )}
          >
            {pageNumber}
          </Link>
        );
      })}
      <Link
        aria-disabled={page === pages}
        href={pageHref(Math.min(page + 1, pages), baseParams)}
        className={cn(
          "inline-flex size-10 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 transition hover:bg-zinc-50",
          page === pages && "pointer-events-none opacity-45",
        )}
      >
        <ChevronRight className="size-4" />
      </Link>
    </nav>
  );
}
