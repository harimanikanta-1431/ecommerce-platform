"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProductGallery({ product }: { product: Product }) {
  const fallbackImage =
    "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1000&q=85";
  const [activeImage, setActiveImage] = useState(
    product.images[0] ?? fallbackImage,
  );

  return (
    <div className="grid gap-3">
      <div className="relative aspect-square overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
        <Image
          src={activeImage}
          alt={product.name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      <div className="grid grid-cols-4 gap-3">
        {product.images.map((image) => {
          const active = image === activeImage;

          return (
            <button
              key={image}
              type="button"
              onClick={() => setActiveImage(image)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg border bg-white transition",
                active
                  ? "border-zinc-950 ring-4 ring-amber-100"
                  : "border-zinc-200 hover:border-zinc-400",
              )}
            >
              <Image
                src={image}
                alt={`${product.name} gallery image`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
