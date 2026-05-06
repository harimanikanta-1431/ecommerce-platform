"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { orderApi } from "@/lib/api";
import { getToken } from "@/lib/auth-client";
import type { Order } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function OrdersClient() {
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setOrders([]);
      return;
    }

    orderApi.mine(token).then(setOrders).catch(() => setOrders([]));
  }, []);

  return (
    <div className="container-shell py-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
        Orders
      </p>
      <h1 className="mt-2 text-3xl font-black text-zinc-950 sm:text-4xl">
        Purchase history
      </h1>

      <div className="mt-8 grid gap-4">
        {orders === null ? (
          <Skeleton className="h-48" />
        ) : orders.length === 0 ? (
          <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center shadow-sm">
            <p className="font-black text-zinc-950">No orders yet</p>
            <Link
              href="/products"
              className="mt-4 inline-flex text-sm font-black text-teal-800"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          orders.map((order) => (
            <article
              key={order.id}
              className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col justify-between gap-3 border-b border-zinc-200 pb-4 sm:flex-row">
                <div>
                  <p className="font-black text-zinc-950">
                    {order.orderNumber}
                  </p>
                  <p className="text-sm text-zinc-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-sm font-black text-zinc-950">
                  {order.status} · {formatCurrency(order.amount)}
                </div>
              </div>
              <div className="mt-4 grid gap-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative size-14 overflow-hidden rounded-lg bg-zinc-100">
                      <Image
                        src={item.product.images[0] ?? "/next.svg"}
                        alt={item.product.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-sm font-bold text-zinc-950">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-zinc-500">Qty {item.quantity}</p>
                    </div>
                    <p className="text-sm font-black text-zinc-950">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
