"use client";

import Link from "next/link";
import {
  LogOut,
  Menu,
  Search,
  ShoppingCart,
  Store,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { cartApi } from "@/lib/api";
import { clearSession, getStoredUser, getToken } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/account/orders", label: "Orders" },
  { href: "/checkout", label: "Checkout" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [userName, setUserName] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    async function refreshSessionState() {
      const token = getToken();
      const user = getStoredUser();
      setUserName(user?.name ?? null);

      if (!token) {
        setCartCount(0);
        return;
      }

      try {
        const cart = await cartApi.get(token);
        setCartCount(
          cart.items.reduce((total, item) => total + item.quantity, 0),
        );
      } catch {
        setCartCount(0);
      }
    }

    void refreshSessionState();
    window.addEventListener("vistamart-auth", refreshSessionState);
    window.addEventListener("vistamart-cart", refreshSessionState);

    return () => {
      window.removeEventListener("vistamart-auth", refreshSessionState);
      window.removeEventListener("vistamart-cart", refreshSessionState);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="container-shell flex h-16 items-center gap-3">
        <Link href="/" className="flex items-center gap-2" aria-label="VistaMart">
          <span className="grid size-10 place-items-center rounded-lg bg-zinc-950 text-white">
            <Store className="size-5" />
          </span>
          <span className="text-lg font-black tracking-tight text-zinc-950">
            VistaMart
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <form className="ml-auto hidden h-11 max-w-md flex-1 items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 transition focus-within:border-zinc-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-amber-100 md:flex">
          <Search className="size-4 text-zinc-500" />
          <input
            aria-label="Search products"
            className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-zinc-400"
            placeholder="Search headphones, shoes, coffee..."
          />
        </form>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <Link
            href="/cart"
            className="relative grid size-10 place-items-center rounded-lg text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950"
            aria-label="Open cart"
          >
            <ShoppingCart className="size-5" />
            <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-amber-400 text-[11px] font-black text-zinc-950">
              {cartCount}
            </span>
          </Link>

          <Link
            href="/login"
            className="hidden h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950 sm:inline-flex"
          >
            <UserRound className="size-4" />
            {userName ?? "Login"}
          </Link>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Logout"
            className="hidden sm:inline-flex"
            onClick={() => {
              clearSession();
              showToast({
                title: "Logged out",
                description: "Your local session has been cleared.",
              });
            }}
          >
            <LogOut className="size-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((current) => !current)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "border-t border-zinc-200 bg-white px-4 py-3 lg:hidden",
          open ? "block" : "hidden",
        )}
      >
        <form className="mb-3 flex h-11 items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3">
          <Search className="size-4 text-zinc-500" />
          <input
            aria-label="Search products"
            className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-zinc-400"
            placeholder="Search products"
          />
        </form>
        <nav className="grid gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/signup"
            className="rounded-lg px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100"
            onClick={() => setOpen(false)}
          >
            Signup
          </Link>
        </nav>
      </div>
    </header>
  );
}
