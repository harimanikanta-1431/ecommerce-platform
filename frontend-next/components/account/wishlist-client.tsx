"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { wishlistApi } from "@/lib/api";
import { getToken } from "@/lib/auth-client";
import type { Product } from "@/lib/types";

export function WishlistClient() {
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setProducts([]);
      return;
    }

    wishlistApi
      .get(token)
      .then((wishlist) => setProducts(wishlist.items.map((item) => item.product)))
      .catch(() => setProducts([]));
  }, []);

  return (
    <div className="container-shell py-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
        Wishlist
      </p>
      <h1 className="mt-2 text-3xl font-black text-zinc-950 sm:text-4xl">
        Saved products
      </h1>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products === null ? (
          <Skeleton className="h-80" />
        ) : (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
}
