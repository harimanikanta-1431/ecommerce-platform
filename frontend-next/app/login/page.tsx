import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Customer login UI.",
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
