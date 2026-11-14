"use client";

import { createContext, useContext, useEffect } from "react";

import { authClient } from "@/lib/auth-client";
import { clearAuthToken } from "@/lib/server-api";

const AuthContext = createContext(null);

function normalizeUser(user) {
  if (!user) return null;

  const email = user.email?.trim().toLowerCase() ?? "";
  const name =
    user.name?.trim() || email.split("@")[0] || "BookNook reader";

  return {
    id: user.id,
    name,
    email,
    image:
      user.image ||
      `https://i.pravatar.cc/150?u=${encodeURIComponent(
        user.id || email || name
      )}`,
  };
}

export function AuthProvider({ children }) {
  const { data: session, isPending } = authClient.useSession();
  const user = normalizeUser(session?.user);
  const userId = session?.user?.id ?? null;

  // A token is tied to one session, so drop the cached JWT whenever the
  // signed-in reader changes (including sign-out).
  useEffect(() => {
    clearAuthToken();
  }, [userId]);

  async function logout() {
    clearAuthToken();

    const { error } = await authClient.signOut();

    if (error) {
      console.error("Unable to sign out", error);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoaded: !isPending,
        isAuthenticated: Boolean(user),
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
