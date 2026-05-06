import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ShieldCheck, Truck } from "lucide-react";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { ProductCard } from "@/components/product/product-card";
import { ProductGallery } from "@/components/product/product-gallery";
import { RatingStars } from "@/components/ui/rating-stars";
import { catalogApi } from "@/lib/api";
import { formatCurrency, getDiscountPercent } from "@/lib/utils";

export const dynamic = "force-dynamic";

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await catalogApi.productBySlug(slug).catch(() => null);

  return {
    title: product?.name ?? "Product",
    description: product?.description,
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await catalogApi.productBySlug(slug).catch(() => null);

  if (!product) {
    notFound();
  }

  const relatedProducts = await catalogApi.related(product);
  const discount = getDiscountPercent(product.price, product.originalPrice);

  return (
    <div className="container-shell py-8">
      <div className="mb-5 text-sm font-semibold text-zinc-500">
        <Link href="/" className="hover:text-zinc-950">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-zinc-950">
          Products
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-950">{product.name}</span>
      </div>

      <section className="grid gap-7 lg:grid-cols-[1fr_0.9fr]">
        <ProductGallery product={product} />

        <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-7">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">
            {product.category.name}
          </p>
          <h1 className="mt-3 text-3xl font-black leading-tight text-zinc-950 sm:text-4xl">
            {product.name}
          </h1>
          <div className="mt-4">
            <RatingStars rating={product.rating} count={product.reviewCount} />
          </div>

          <p className="mt-5 text-base leading-7 text-zinc-600">
            {product.description}
          </p>

          <div className="mt-6 flex flex-wrap items-end gap-3">
            <p className="text-4xl font-black text-zinc-950">
              {formatCurrency(product.price)}
            </p>
            {product.originalPrice ? (
              <p className="pb-1 text-lg font-semibold text-zinc-400 line-through">
                {formatCurrency(product.originalPrice)}
              </p>
            ) : null}
            {discount ? (
              <span className="mb-1 rounded-full bg-amber-100 px-3 py-1 text-sm font-black text-amber-800">
                Save {discount}%
              </span>
            ) : null}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
              <Truck className="size-5 text-teal-700" />
              <p className="mt-2 text-sm font-bold text-zinc-950">
                Fast delivery
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
              <ShieldCheck className="size-5 text-teal-700" />
              <p className="mt-2 text-sm font-bold text-zinc-950">
                Buyer protection
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
              <CheckCircle2 className="size-5 text-emerald-600" />
              <p className="mt-2 text-sm font-bold text-zinc-950">
                {product.stock} in stock
              </p>
            </div>
          </div>

          <div className="mt-6">
            <AddToCartButton product={product} fullWidth />
          </div>

          <div className="mt-7 border-t border-zinc-200 pt-6">
            <h2 className="text-lg font-black text-zinc-950">
              Product details
            </h2>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-zinc-600">
              {product.details.map((detail) => (
                <li key={detail} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-10 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
              Customer notes
            </p>
            <h2 className="mt-2 text-2xl font-black text-zinc-950">
              Ratings & reviews
            </h2>
          </div>
          <RatingStars rating={product.rating} count={product.reviewCount} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {product.reviews.map((review) => (
            <article
              key={review.id}
              className="rounded-lg border border-zinc-200 bg-zinc-50 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-black text-zinc-950">{review.title}</h3>
                  <p className="mt-1 text-sm font-medium text-zinc-500">
                    {review.user?.name ?? "Customer"} ·{" "}
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <RatingStars rating={review.rating} compact />
              </div>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                {review.comment}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
            More to compare
          </p>
          <h2 className="mt-2 text-2xl font-black text-zinc-950">
            Related products
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {relatedProducts.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
