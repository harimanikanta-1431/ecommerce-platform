import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { MotionReveal } from "@/components/ui/motion-reveal";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

type ProductSectionProps = {
  eyebrow: string;
  title: string;
  products: Product[];
  tone?: "cool" | "warm";
};

export function ProductSection({
  eyebrow,
  title,
  products,
  tone = "cool",
}: ProductSectionProps) {
  return (
    <section
      className={cn(
        "mt-12 py-10",
        tone === "warm" ? "bg-white" : "bg-transparent",
      )}
    >
      <div className="container-shell">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p
              className={cn(
                "text-sm font-semibold uppercase tracking-[0.18em]",
                tone === "warm" ? "text-amber-700" : "text-teal-700",
              )}
            >
              {eyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-bold text-zinc-950 sm:text-3xl">
              {title}
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950 sm:inline-flex"
          >
            View all
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <MotionReveal className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </MotionReveal>
      </div>
    </section>
  );
}
