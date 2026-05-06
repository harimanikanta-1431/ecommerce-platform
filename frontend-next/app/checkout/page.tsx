import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Secure checkout with address capture and order summary.",
};

export default function CheckoutPage() {
  return <CheckoutForm />;
}
