"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { authApi } from "@/lib/api";
import { saveSession } from "@/lib/auth-client";

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const { showToast } = useToast();
  const isLogin = mode === "login";
  const router = useRouter();

  return (
    <div className="container-shell flex min-h-[calc(100vh-8rem)] items-center justify-center py-10">
      <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mx-auto grid size-12 place-items-center rounded-lg bg-zinc-950 text-white">
          {isLogin ? (
            <LogIn className="size-6" />
          ) : (
            <UserPlus className="size-6" />
          )}
        </div>
        <div className="mt-5 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
            Account
          </p>
          <h1 className="mt-2 text-3xl font-black text-zinc-950">
            {isLogin ? "Welcome back" : "Create account"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            {isLogin
              ? "Access your customer dashboard UI."
              : "Create your customer account."}
          </p>
        </div>

        <form
          className="mt-7 grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);

            const request = isLogin
              ? authApi.login(
                  String(form.get("email")),
                  String(form.get("password")),
                )
              : authApi.register({
                  name: String(form.get("name")),
                  email: String(form.get("email")),
                  password: String(form.get("password")),
                });

            request
              .then((session) => {
                saveSession(session);
                showToast({
                  title: isLogin ? "Logged in" : "Account created",
                  description: `Welcome, ${session.user.name}.`,
                });
                router.push("/account");
              })
              .catch((error) => {
                showToast({
                  title: "Authentication failed",
                  description:
                    error instanceof Error ? error.message : "Please try again.",
                });
              });
          }}
        >
          {!isLogin ? (
            <label className="grid gap-2 text-sm font-bold text-zinc-800">
              Full name
              <Input required name="name" placeholder="Avery Stone" />
            </label>
          ) : null}
          <label className="grid gap-2 text-sm font-bold text-zinc-800">
            Email address
            <Input
              required
              name="email"
              type="email"
              placeholder="avery@example.com"
              defaultValue={isLogin ? "customer@vistamart.test" : undefined}
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-zinc-800">
            Password
            <Input
              required
              name="password"
              type="password"
              placeholder="Password"
              defaultValue={isLogin ? "Customer123!" : undefined}
            />
          </label>
          {!isLogin ? (
            <label className="grid gap-2 text-sm font-bold text-zinc-800">
              Confirm password
              <Input required type="password" placeholder="Confirm password" />
            </label>
          ) : null}
          <Button type="submit" size="lg" className="mt-2 w-full">
            {isLogin ? (
              <LogIn className="size-4" />
            ) : (
              <UserPlus className="size-4" />
            )}
            {isLogin ? "Login" : "Signup"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-600">
          {isLogin ? "Need an account?" : "Already have an account?"}{" "}
          <Link
            href={isLogin ? "/signup" : "/login"}
            className="font-black text-zinc-950 hover:text-teal-800"
          >
            {isLogin ? "Signup" : "Login"}
          </Link>
        </p>
      </div>
    </div>
  );
}
