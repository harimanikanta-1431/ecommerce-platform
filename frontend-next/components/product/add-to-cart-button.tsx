"use client";

import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { cartApi } from "@/lib/api";
import { getToken } from "@/lib/auth-client";
import type { Product } from "@/lib/types";

type AddToCartButtonProps = {
  product: Product;
  fullWidth?: boolean;
};

export function AddToCartButton({
  product,
  fullWidth = false,
}: AddToCartButtonProps) {
  const { showToast } = useToast();
  const router = useRouter();

  return (
    <Button
      type="button"
      className={fullWidth ? "w-full" : undefined}
      onClick={async () => {
        const token = getToken();

        if (!token) {
          showToast({
            title: "Login required",
            description: "Please login to add products to your cart.",
          });
          router.push("/login");
          return;
        }

        try {
          await cartApi.add(token, product.id, 1);
          window.dispatchEvent(new Event("vistamart-cart"));
          showToast({
            title: "Added to cart",
            description: `${product.name} is now in your cart.`,
          });
        } catch (error) {
          showToast({
            title: "Cart update failed",
            description:
              error instanceof Error ? error.message : "Please try again.",
          });
        }
      }}
    >
      <ShoppingCart className="size-4" />
      Add to cart
    </Button>
  );
}
