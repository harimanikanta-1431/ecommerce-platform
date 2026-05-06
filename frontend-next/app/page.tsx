import { CategoryCard } from "@/components/product/category-card";
import { HeroBanner } from "@/components/product/hero-banner";
import { ProductSection } from "@/components/product/product-section";
import { catalogApi } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [categories, featuredProducts, trendingProducts] = await Promise.all([
    catalogApi.categories(),
    catalogApi.featured(),
    catalogApi.trending(),
  ]);

  return (
    <div className="pb-14">
      <HeroBanner />

      <section className="container-shell mt-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
              Shop by department
            </p>
            <h2 className="mt-2 text-2xl font-bold text-zinc-950 sm:text-3xl">
              Popular categories
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.data.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <ProductSection
        eyebrow="Editor picks"
        title="Featured products"
        products={featuredProducts}
      />

      <ProductSection
        eyebrow="High demand"
        title="Trending now"
        products={trendingProducts}
        tone="warm"
      />
    </div>
  );
}
