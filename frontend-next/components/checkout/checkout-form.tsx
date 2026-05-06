"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { CreditCard, LockKeyhole, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { cartApi, orderApi } from "@/lib/api";
import { getStoredUser, getToken } from "@/lib/auth-client";
import type { Cart } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function CheckoutForm() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const router = useRouter();
  const user = typeof window !== "undefined" ? getStoredUser() : null;

  useEffect(() => {
    const token = getToken();

    if (!token) {
      setLoading(false);
      return;
    }

    cartApi
      .get(token)
      .then(setCart)
      .catch((error) => {
        showToast({
          title: "Checkout unavailable",
          description: error instanceof Error ? error.message : "Please try again.",
        });
      })
      .finally(() => setLoading(false));
  }, [showToast]);

  if (loading) {
    return (
      <div className="container-shell py-8">
        <Skeleton className="h-10 w-72" />
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
          <Skeleton className="h-[620px]" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!cart) {
    return (
      <div className="container-shell py-16">
        <div className="mx-auto max-w-lg rounded-lg border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-3xl font-black text-zinc-950">
            Login to checkout
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Checkout uses your backend cart and requires authentication.
          </p>
          <Button className="mt-6" onClick={() => router.push("/login")}>
            Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-shell py-8">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
          Checkout
        </p>
        <h1 className="mt-2 text-3xl font-black text-zinc-950 sm:text-4xl">
          Shipping and payment
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <form
          className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-7"
          onSubmit={async (event) => {
            event.preventDefault();
            const token = getToken();
            if (!token) {
              router.push("/login");
              return;
            }

            const form = new FormData(event.currentTarget);

            try {
              const order = await orderApi.place(token, {
                couponCode: String(form.get("couponCode") ?? "") || undefined,
                address: {
                  fullName: String(form.get("fullName")),
                  phone: String(form.get("phone")),
                  line1: String(form.get("line1")),
                  line2: String(form.get("line2") ?? "") || undefined,
                  city: String(form.get("city")),
                  state: String(form.get("state")),
                  postalCode: String(form.get("postalCode")),
                  country: String(form.get("country")),
                },
              });
              await orderApi.pay(token, order.id);
              window.dispatchEvent(new Event("vistamart-cart"));
              showToast({
                title: "Order placed",
                description: `${order.orderNumber} is now paid in demo mode.`,
              });
              router.push("/account/orders");
            } catch (error) {
              showToast({
                title: "Checkout failed",
                description:
                  error instanceof Error ? error.message : "Please try again.",
              });
            }
          }}
        >
          <div className="mb-6 flex items-center gap-2">
            <MapPin className="size-5 text-teal-700" />
            <h2 className="text-xl font-black text-zinc-950">
              Delivery address
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-zinc-800">
              Full name
              <Input
                required
                name="fullName"
                placeholder="Avery Stone"
                defaultValue={user?.name}
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-zinc-800">
              Phone
              <Input
                required
                name="phone"
                placeholder="+1 555 0100"
                defaultValue={user?.phone}
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-zinc-800 sm:col-span-2">
              Street address
              <Input required name="line1" placeholder="120 Market Street" />
            </label>
            <label className="grid gap-2 text-sm font-bold text-zinc-800 sm:col-span-2">
              Apartment, suite, etc.
              <Input name="line2" placeholder="Suite 4B" />
            </label>
            <label className="grid gap-2 text-sm font-bold text-zinc-800">
              City
              <Input required name="city" placeholder="San Francisco" />
            </label>
            <label className="grid gap-2 text-sm font-bold text-zinc-800">
              State
              <Input required name="state" placeholder="CA" />
            </label>
            <label className="grid gap-2 text-sm font-bold text-zinc-800">
              ZIP code
              <Input required name="postalCode" placeholder="94105" />
            </label>
            <label className="grid gap-2 text-sm font-bold text-zinc-800">
              Country
              <Input
                required
                name="country"
                placeholder="United States"
                defaultValue={user?.country ?? "United States"}
              />
            </label>
          </div>

          <div className="mt-8 border-t border-zinc-200 pt-6">
            <div className="mb-4 flex items-center gap-2">
              <CreditCard className="size-5 text-teal-700" />
              <h2 className="text-xl font-black text-zinc-950">
                Payment method
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold text-zinc-800 sm:col-span-2">
                Coupon
                <Input name="couponCode" placeholder="WELCOME10" />
              </label>
              <label className="grid gap-2 text-sm font-bold text-zinc-800 sm:col-span-2">
                Card number
                <Input placeholder="4242 4242 4242 4242" />
              </label>
              <label className="grid gap-2 text-sm font-bold text-zinc-800">
                Expiry
                <Input placeholder="12 / 28" />
              </label>
              <label className="grid gap-2 text-sm font-bold text-zinc-800">
                CVV
                <Input placeholder="123" />
              </label>
            </div>
          </div>

          <Button type="submit" size="lg" className="mt-7 w-full">
            <LockKeyhole className="size-4" />
            Pay {formatCurrency(cart.summary.total)}
          </Button>
        </form>

        <aside className="h-fit rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-zinc-950">Order summary</h2>
          <div className="mt-5 grid gap-4">
            {cart.items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                  <Image
                    src={item.product.images[0] ?? "/next.svg"}
                    alt={item.product.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-sm font-bold text-zinc-950">
                    {item.product.name}
                  </p>
                  <p className="mt-1 text-xs font-medium text-zinc-500">
                    Qty {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-black text-zinc-950">
                  {formatCurrency(item.product.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-3 border-t border-zinc-200 pt-5 text-sm">
            <SummaryRow label="Subtotal" value={formatCurrency(cart.summary.subtotal)} />
            <SummaryRow
              label="Shipping"
              value={
                cart.summary.shipping === 0
                  ? "Free"
                  : formatCurrency(cart.summary.shipping)
              }
            />
            <SummaryRow label="Estimated tax" value={formatCurrency(cart.summary.tax)} />
            <div className="mt-2 flex justify-between border-t border-zinc-200 pt-4 text-base">
              <span className="font-black text-zinc-950">Total</span>
              <span className="font-black text-zinc-950">
                {formatCurrency(cart.summary.total)}
              </span>
            </div>
          </div>
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
