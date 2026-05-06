import type { Metadata } from "next";
import { Pagination } from "@/components/product/pagination";
import { ProductCard } from "@/components/product/product-card";
import {
  ProductFilters,
  type ProductFilterState,
} from "@/components/product/product-filters";
import { catalogApi } from "@/lib/api";
import { toNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse VistaMart products with category, price, rating filters.",
};

type ProductsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const pageSize = 8;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = (await searchParams) ?? {};
  const page = Math.max(toNumber(params.page, 1), 1);
  const current: ProductFilterState = {
    category: first(params.category),
    minPrice: first(params.minPrice),
    maxPrice: first(params.maxPrice),
    rating: first(params.rating),
    sort: first(params.sort) ?? "popularity",
  };

  const [categories, products] = await Promise.all([
    catalogApi.categories(),
    catalogApi.products({
      page,
      limit: pageSize,
      category: current.category,
      minPrice: current.minPrice,
      maxPrice: current.maxPrice,
      rating: current.rating,
      sort: current.sort,
      search: first(params.search),
    }),
  ]);
  const pages = products.pagination.pages;
  const safePage = products.pagination.page;
  const visibleProducts = products.data;

  const baseParams = new URLSearchParams();
  Object.entries(current).forEach(([key, value]) => {
    if (value) {
      baseParams.set(key, value);
    }
  });

  return (
    <div className="container-shell py-8">
      <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
          Storefront
        </p>
        <div className="mt-2 flex flex-col justify-between gap-3 lg:flex-row lg:items-end">
          <div>
            <h1 className="text-3xl font-black text-zinc-950 sm:text-4xl">
              Product catalog
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
              Browse live catalog data with category, price, rating, search,
              sorting, and pagination.
            </p>
          </div>
          <p className="rounded-full bg-amber-100 px-3 py-1 text-sm font-black text-amber-800">
            {products.pagination.total} products
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <ProductFilters current={current} categories={categories.data} />

        <section>
          {visibleProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center shadow-sm">
              <h2 className="text-xl font-black text-zinc-950">
                No products found
              </h2>
              <p className="mt-2 text-sm text-zinc-600">
                Try a wider price range or reset your filters.
              </p>
            </div>
          )}

          <Pagination page={safePage} pages={pages} baseParams={baseParams} />
        </section>
      </div>
    </div>
  );
}
