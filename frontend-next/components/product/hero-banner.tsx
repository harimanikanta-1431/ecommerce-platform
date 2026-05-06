import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgePercent, PackageCheck, Sparkles } from "lucide-react";

const heroImage =
  "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1800&q=85";

export function HeroBanner() {
  return (
    <section className="relative isolate overflow-hidden bg-zinc-950">
      <Image
        src={heroImage}
        alt="Premium ecommerce products arranged on a shopping table"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-55"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/72 to-zinc-950/20" />

      <div className="container-shell relative flex min-h-[420px] items-center py-12 sm:min-h-[500px]">
        <div className="max-w-2xl text-white">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-semibold backdrop-blur">
            <Sparkles className="size-4 text-amber-300" />
            Weekend drops are live
          </div>
          <h1 className="mt-5 text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
            VistaMart
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-zinc-100 sm:text-lg">
            Premium electronics, home upgrades, fashion staples, and daily
            essentials in one clean storefront.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/products"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-amber-400 px-5 text-sm font-black text-zinc-950 transition hover:bg-amber-300"
            >
              Shop deals
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/products?sort=popularity"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/25 bg-white/10 px-5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
            >
              Trending products
            </Link>
          </div>
          <div className="mt-8 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 p-3 backdrop-blur">
              <PackageCheck className="size-5 text-teal-300" />
              <span className="text-sm font-semibold">Free shipping</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 p-3 backdrop-blur">
              <BadgePercent className="size-5 text-amber-300" />
              <span className="text-sm font-semibold">Daily offers</span>
            </div>
            <div className="col-span-2 flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 p-3 backdrop-blur sm:col-span-1">
              <Sparkles className="size-5 text-fuchsia-300" />
              <span className="text-sm font-semibold">Top brands</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
