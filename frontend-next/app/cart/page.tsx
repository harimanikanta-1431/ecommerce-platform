import type { Metadata } from "next";
import { CartClient } from "@/components/cart/cart-client";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review selected products and cart totals.",
};

export default function CartPage() {
  return <CartClient />;
}
