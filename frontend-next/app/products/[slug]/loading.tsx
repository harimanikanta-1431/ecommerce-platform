import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailLoading() {
  return (
    <div className="container-shell py-8">
      <div className="grid gap-7 lg:grid-cols-[1fr_0.9fr]">
        <Skeleton className="aspect-square w-full" />
        <div className="rounded-lg border border-zinc-200 bg-white p-7">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-4 h-10 w-3/4" />
          <Skeleton className="mt-4 h-5 w-48" />
          <Skeleton className="mt-6 h-24 w-full" />
          <Skeleton className="mt-6 h-12 w-44" />
          <Skeleton className="mt-6 h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
