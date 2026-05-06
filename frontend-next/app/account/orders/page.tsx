import type { Metadata } from "next";
import { OrdersClient } from "@/components/account/orders-client";

export const metadata: Metadata = {
  title: "Orders",
};

export default function OrdersPage() {
  return <OrdersClient />;
}
