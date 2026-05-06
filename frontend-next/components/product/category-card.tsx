import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/lib/types";

export function CategoryCard({ category }: { category: Category }) {
  const accent = "bg-sky-100 text-sky-800";
  const image =
    category.image ??
    "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=700&q=80";

  return (
    <Link
      href={`/products?category=${category.slug}`}
      className="group overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-zinc-900/10"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image}
          alt={category.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-3">
        <span
          className={`inline-flex rounded-full px-2 py-1 text-[11px] font-black ${accent}`}
        >
          {category.productCount} items
        </span>
        <div className="mt-2 flex items-center justify-between gap-2">
          <h3 className="text-sm font-black text-zinc-950">{category.name}</h3>
          <ArrowRight className="size-4 text-zinc-400 transition group-hover:translate-x-1 group-hover:text-zinc-950" />
        </div>
        <p className="mt-1 text-xs leading-5 text-zinc-500">
          {category.description ?? "Explore products"}
        </p>
      </div>
    </Link>
  );
}
