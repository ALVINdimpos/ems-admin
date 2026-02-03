import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | EMS",
  description: "Sign in to your EMS account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
