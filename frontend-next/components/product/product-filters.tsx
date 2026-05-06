import Link from "next/link";
import { Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import type { Category } from "@/lib/types";

export type ProductFilterState = {
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  rating?: string;
  sort?: string;
};

export function ProductFilters({
  current,
  categories,
}: {
  current: ProductFilterState;
  categories: Category[];
}) {
  return (
    <aside className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <SlidersHorizontal className="size-5 text-teal-700" />
        <h2 className="text-base font-black text-zinc-950">Filters</h2>
      </div>

      <form className="grid gap-5">
        <div>
          <label
            htmlFor="category"
            className="mb-2 block text-sm font-bold text-zinc-800"
          >
            Category
          </label>
          <Select
            id="category"
            name="category"
            defaultValue={current.category ?? ""}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <p className="mb-2 text-sm font-bold text-zinc-800">Price range</p>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              min="0"
              name="minPrice"
              placeholder="Min"
              defaultValue={current.minPrice ?? ""}
            />
            <Input
              type="number"
              min="0"
              name="maxPrice"
              placeholder="Max"
              defaultValue={current.maxPrice ?? ""}
            />
          </div>
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-bold text-zinc-800">
            Rating
          </legend>
          <div className="grid gap-2 text-sm font-medium text-zinc-700">
            {["4", "4.5"].map((rating) => (
              <label
                key={rating}
                className="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 transition hover:border-amber-300 hover:bg-amber-50"
              >
                <input
                  type="radio"
                  name="rating"
                  value={rating}
                  defaultChecked={current.rating === rating}
                  className="accent-zinc-950"
                />
                {rating}+ stars
              </label>
            ))}
            <label className="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 transition hover:border-amber-300 hover:bg-amber-50">
              <input
                type="radio"
                name="rating"
                value=""
                defaultChecked={!current.rating}
                className="accent-zinc-950"
              />
              Any rating
            </label>
          </div>
        </fieldset>

        <div>
          <label
            htmlFor="sort"
            className="mb-2 block text-sm font-bold text-zinc-800"
          >
            Sort by
          </label>
          <Select id="sort" name="sort" defaultValue={current.sort ?? "popularity"}>
            <option value="popularity">Popularity</option>
            <option value="price-asc">Price low-high</option>
            <option value="price-desc">Price high-low</option>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button type="submit">
            <Filter className="size-4" />
            Apply
          </Button>
          <Link
            href="/products"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 text-sm font-bold text-zinc-700 shadow-sm transition hover:bg-zinc-50 hover:text-zinc-950"
          >
            Reset
          </Link>
        </div>
      </form>
    </aside>
  );
}
