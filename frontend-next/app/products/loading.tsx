import { ProductCardSkeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
  return (
    <div className="container-shell py-8">
      <div className="mb-6 h-36 animate-pulse rounded-lg bg-white" />
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="h-[520px] animate-pulse rounded-lg bg-white" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
