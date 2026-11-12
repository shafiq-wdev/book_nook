"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/auth-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { loginHref } from "@/lib/auth-redirect";

function AuthLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Skeleton className="h-9 w-48" />
      <Skeleton className="mt-3 h-4 w-80 max-w-full" />
      <Skeleton className="mt-8 h-64 w-full rounded-2xl" />
    </div>
  );
}

export function RequireAuth({ children }) {
  const { user, isLoaded } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoaded && !user) {
      router.replace(loginHref(pathname));
    }
  }, [isLoaded, pathname, router, user]);

  if (!isLoaded || !user) {
    return <AuthLoading />;
  }

  return children;
}
