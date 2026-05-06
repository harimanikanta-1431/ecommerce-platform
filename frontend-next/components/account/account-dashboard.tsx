"use client";

import Link from "next/link";
import { Heart, PackageCheck, ShoppingCart, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { authApi, cartApi, orderApi, wishlistApi } from "@/lib/api";
import { getToken } from "@/lib/auth-client";
import type { User } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function AccountDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [stats, setStats] = useState({
    cartItems: 0,
    orders: 0,
    wishlist: 0,
    spend: 0,
  });

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setAuthenticated(false);
      return;
    }
    setAuthenticated(true);

    Promise.all([
      authApi.me(token),
      cartApi.get(token),
      orderApi.mine(token),
      wishlistApi.get(token),
    ]).then(([me, cart, orders, wishlist]) => {
      setUser(me);
      setStats({
        cartItems: cart.items.reduce((total, item) => total + item.quantity, 0),
        orders: orders.length,
        wishlist: wishlist.items.length,
        spend: orders.reduce((total, order) => total + order.amount, 0),
      });
    });
  }, []);

  if (authenticated === false) {
    return (
      <div className="container-shell py-16">
        <div className="mx-auto max-w-lg rounded-lg border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <UserRound className="mx-auto size-10 text-teal-700" />
          <h1 className="mt-4 text-3xl font-black text-zinc-950">
            Login required
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Your dashboard is powered by your backend account.
          </p>
          <Button className="mt-6">
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-shell py-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
        Account
      </p>
      <h1 className="mt-2 text-3xl font-black text-zinc-950 sm:text-4xl">
        {user ? `Welcome, ${user.name}` : "Loading account..."}
      </h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric icon={ShoppingCart} label="Cart items" value={stats.cartItems} />
        <Metric icon={PackageCheck} label="Orders" value={stats.orders} />
        <Metric icon={Heart} label="Wishlist" value={stats.wishlist} />
        <Metric
          icon={PackageCheck}
          label="Total spend"
          value={formatCurrency(stats.spend)}
        />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link
          href="/cart"
          className="rounded-lg border border-zinc-200 bg-white p-5 font-black text-zinc-950 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
        >
          Manage cart
        </Link>
        <Link
          href="/account/orders"
          className="rounded-lg border border-zinc-200 bg-white p-5 font-black text-zinc-950 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
        >
          View orders
        </Link>
        <Link
          href="/wishlist"
          className="rounded-lg border border-zinc-200 bg-white p-5 font-black text-zinc-950 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
        >
          Wishlist
        </Link>
      </div>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof ShoppingCart;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <Icon className="size-6 text-teal-700" />
      <p className="mt-3 text-sm font-semibold text-zinc-500">{label}</p>
      <p className="mt-1 text-2xl font-black text-zinc-950">{value}</p>
    </div>
  );
}
