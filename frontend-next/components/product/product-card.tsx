import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { RatingStars } from "@/components/ui/rating-stars";
import type { Product } from "@/lib/types";
import { formatCurrency, getDiscountPercent } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const discount = getDiscountPercent(product.price, product.originalPrice);
  const image =
    product.images[0] ??
    "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1000&q=85";
  const badge = product.isFeatured
    ? "Featured"
    : product.isTrending
      ? "Trending"
      : null;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-zinc-900/10">
      <Link href={`/products/${product.slug}`} className="relative block">
        <div className="relative aspect-square overflow-hidden bg-zinc-100">
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {badge ? (
            <span className="rounded-full bg-zinc-950 px-2.5 py-1 text-xs font-black text-white">
              {badge}
            </span>
          ) : null}
          {discount ? (
            <span className="rounded-full bg-amber-400 px-2.5 py-1 text-xs font-black text-zinc-950">
              {discount}% off
            </span>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">
              {product.category.name}
            </p>
            <Link href={`/products/${product.slug}`}>
              <h3 className="mt-1 text-base font-black leading-6 text-zinc-950 transition group-hover:text-teal-800">
                {product.name}
              </h3>
            </Link>
          </div>
          <button
            type="button"
            aria-label={`Save ${product.name}`}
            className="grid size-9 shrink-0 place-items-center rounded-lg border border-zinc-200 text-zinc-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
          >
            <Heart className="size-4" />
          </button>
        </div>

        <p className="line-clamp-2 text-sm leading-6 text-zinc-600">
          {product.description}
        </p>

        <div className="mt-3">
          <RatingStars
            rating={product.rating}
            count={product.reviewCount}
            compact
          />
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div>
            <p className="text-xl font-black text-zinc-950">
              {formatCurrency(product.price)}
            </p>
            {product.originalPrice ? (
              <p className="text-sm font-medium text-zinc-400 line-through">
                {formatCurrency(product.originalPrice)}
              </p>
            ) : null}
          </div>
          <AddToCartButton product={product} />
        </div>
      </div>
    </article>
  );
}
