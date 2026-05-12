"use client";

import { useAuth } from "@/lib/auth-context";
import { Topbar } from "@/components/topbar";
import { Footer } from "@/components/footer";
import { Container } from "@/components/ui";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Topbar />
      <Container>{children}</Container>
      <Footer />
    </>
  );
}
