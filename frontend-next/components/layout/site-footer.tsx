import Link from "next/link";
import { Mail, ShieldCheck, Truck, WalletCards } from "lucide-react";

const promises = [
  { icon: Truck, label: "Fast delivery" },
  { icon: ShieldCheck, label: "Secure checkout" },
  { icon: WalletCards, label: "Easy returns" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="container-shell py-10">
        <div className="grid gap-4 sm:grid-cols-3">
          {promises.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4"
            >
              <item.icon className="size-5 text-teal-700" />
              <span className="text-sm font-bold text-zinc-800">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col justify-between gap-6 border-t border-zinc-200 pt-8 md:flex-row">
          <div>
            <p className="text-lg font-black text-zinc-950">VistaMart</p>
            <p className="mt-2 max-w-md text-sm leading-6 text-zinc-600">
              Static ecommerce storefront UI built for clean API integration
              later.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
            <div className="grid gap-2">
              <p className="font-bold text-zinc-950">Shop</p>
              <Link className="text-zinc-600 hover:text-zinc-950" href="/products">
                Products
              </Link>
              <Link className="text-zinc-600 hover:text-zinc-950" href="/cart">
                Cart
              </Link>
            </div>
            <div className="grid gap-2">
              <p className="font-bold text-zinc-950">Account</p>
              <Link className="text-zinc-600 hover:text-zinc-950" href="/login">
                Login
              </Link>
              <Link className="text-zinc-600 hover:text-zinc-950" href="/signup">
                Signup
              </Link>
            </div>
            <div className="grid gap-2">
              <p className="font-bold text-zinc-950">Contact</p>
              <span className="inline-flex items-center gap-2 text-zinc-600">
                <Mail className="size-4" />
                hello@vistamart.test
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
