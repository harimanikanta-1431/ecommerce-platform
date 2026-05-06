import type { Metadata } from "next";
import { WishlistClient } from "@/components/account/wishlist-client";

export const metadata: Metadata = {
  title: "Wishlist",
};

export default function WishlistPage() {
  return <WishlistClient />;
}
