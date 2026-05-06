import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-shell flex min-h-[60vh] items-center justify-center py-12">
      <div className="max-w-lg rounded-lg border border-zinc-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-amber-100 text-amber-800">
          <SearchX className="size-7" />
        </div>
        <h1 className="mt-5 text-3xl font-black text-zinc-950">
          Product not found
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          The item may have moved or the storefront route does not exist.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-zinc-950 px-4 text-sm font-black text-white transition hover:bg-zinc-800"
        >
          Browse products
        </Link>
      </div>
    </div>
  );
}
