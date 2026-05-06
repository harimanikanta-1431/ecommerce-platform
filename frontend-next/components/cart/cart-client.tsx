"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { cartApi } from "@/lib/api";
import { getToken } from "@/lib/auth-client";
import type { Cart } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function CartClient() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const { showToast } = useToast();

  const totals = useMemo(
    () =>
      cart?.summary ?? {
        subtotal: 0,
        shipping: 0,
        tax: 0,
        total: 0,
      },
    [cart],
  );

  async function loadCart() {
    const token = getToken();
    setAuthenticated(Boolean(token));

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setCart(await cartApi.get(token));
    } catch (error) {
      showToast({
        title: "Could not load cart",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadCart();
  }, []);

  async function updateQuantity(itemId: string, quantity: number) {
    const token = getToken();
    if (!token) {
      return;
    }

    const nextCart = await cartApi.update(token, itemId, Math.max(quantity, 1));
    setCart(nextCart);
    window.dispatchEvent(new Event("vistamart-cart"));
  }

  async function removeItem(itemId: string) {
    const token = getToken();
    if (!token) {
      return;
    }

    const nextCart = await cartApi.remove(token, itemId);
    setCart(nextCart);
    window.dispatchEvent(new Event("vistamart-cart"));
    showToast({ title: "Removed from cart" });
  }

  if (loading) {
    return (
      <div className="container-shell py-8">
        <Skeleton className="h-10 w-60" />
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <Skeleton className="h-96" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="container-shell py-16">
        <EmptyCart
          title="Login to view your cart"
          description="Your cart is persisted in the backend once you sign in."
          actionLabel="Login"
          actionHref="/login"
        />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container-shell py-16">
        <EmptyCart
          title="Your cart is empty"
          description="Add products and they will appear here from the backend cart."
          actionLabel="Browse products"
          actionHref="/products"
        />
      </div>
    );
  }

  return (
    <div className="container-shell py-8">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
          Shopping cart
        </p>
        <h1 className="mt-2 text-3xl font-black text-zinc-950 sm:text-4xl">
          Review your items
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="grid gap-3">
          {cart.items.map((item) => {
            const image = item.product.images[0] ?? "/next.svg";

            return (
              <article
                key={item.id}
                className="grid gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:grid-cols-[120px_1fr_auto]"
              >
                <Link
                  href={`/products/${item.product.slug}`}
                  className="relative aspect-square overflow-hidden rounded-lg bg-zinc-100"
                >
                  <Image
                    src={image}
                    alt={item.product.name}
                    fill
                    sizes="140px"
                    className="object-cover"
                  />
                </Link>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">
                    {item.product.category.name}
                  </p>
                  <Link href={`/products/${item.product.slug}`}>
                    <h2 className="mt-1 text-lg font-black text-zinc-950 hover:text-teal-800">
                      {item.product.name}
                    </h2>
                  </Link>
                  <p className="mt-3 text-xl font-black text-zinc-950">
                    {formatCurrency(item.product.price)}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                  <div className="flex items-center rounded-lg border border-zinc-200">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Decrease quantity for ${item.product.name}`}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="size-4" />
                    </Button>
                    <span className="w-10 text-center text-sm font-black text-zinc-950">
                      {item.quantity}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Increase quantity for ${item.product.name}`}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="size-4" />
                    Remove
                  </Button>
                </div>
              </article>
            );
          })}
        </section>

        <aside className="h-fit rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-zinc-950">Order summary</h2>
          <div className="mt-5 grid gap-3 text-sm">
            <SummaryRow label="Subtotal" value={formatCurrency(totals.subtotal)} />
            <SummaryRow
              label="Shipping"
              value={totals.shipping === 0 ? "Free" : formatCurrency(totals.shipping)}
            />
            <SummaryRow label="Estimated tax" value={formatCurrency(totals.tax)} />
            <div className="mt-2 flex justify-between border-t border-zinc-200 pt-4 text-base">
              <span className="font-black text-zinc-950">Total</span>
              <span className="font-black text-zinc-950">
                {formatCurrency(totals.total)}
              </span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-lg bg-zinc-950 px-5 text-sm font-black text-white transition hover:bg-zinc-800"
          >
            Continue to checkout
          </Link>
        </aside>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-zinc-600">{label}</span>
      <span className="font-bold text-zinc-950">{value}</span>
    </div>
  );
}

function EmptyCart({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description: string;
  actionHref: string;
  actionLabel: string;
}) {
  return (
    <div className="mx-auto max-w-xl rounded-lg border border-zinc-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto grid size-14 place-items-center rounded-full bg-amber-100 text-amber-800">
        <ShoppingBag className="size-7" />
      </div>
      <h1 className="mt-5 text-3xl font-black text-zinc-950">{title}</h1>
      <p className="mt-2 text-sm leading-6 text-zinc-600">{description}</p>
      <Link
        href={actionHref}
        className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-zinc-950 px-4 text-sm font-black text-white transition hover:bg-zinc-800"
      >
        {actionLabel}
      </Link>
    </div>
  );
}
