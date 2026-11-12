"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { GoogleIcon } from "@/components/auth/google-icon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { describeGoogleAuthError } from "@/lib/auth-errors";
import {
  registerHref,
  sanitizeNextPath,
} from "@/lib/auth-redirect";

function LoginFallback() {
  return (
    <div className="mx-auto my-10 w-full max-w-md px-5">
      <Card>
        <CardContent className="grid gap-4 pt-6">
          <Skeleton className="mx-auto h-7 w-24" />
          <Skeleton className="mx-auto h-4 w-64 max-w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const nextPath = sanitizeNextPath(searchParams.get("next"));
  const justRegistered = searchParams.get("registered") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  async function handleEmailLogin(event) {
    event.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading("email");

    try {
      const { error: signInError } = await authClient.signIn.email({
        email: trimmedEmail,
        password,
      });

      if (signInError) {
        const message =
          signInError.message || "Invalid email or password.";
        setError(message);
        toast.add({
          type: "error",
          title: "Login failed",
          description: message,
        });
        return;
      }

      router.replace(nextPath);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong while signing in.";
      setError(message);
      toast.add({
        type: "error",
        title: "Login failed",
        description: message,
      });
    } finally {
      setLoading(null);
    }
  }

  async function handleGoogleLogin() {
    setError(null);
    setLoading("google");

    try {
      const { error: socialError } = await authClient.signIn.social({
        provider: "google",
        callbackURL: nextPath,
      });

      if (socialError) {
        const message = describeGoogleAuthError(socialError);
        setError(message);
        toast.add({
          type: "error",
          title: "Google login failed",
          description: message,
        });
        setLoading(null);
      }
    } catch (err) {
      const message = describeGoogleAuthError(err);
      setError(message);
      toast.add({
        type: "error",
        title: "Google login failed",
        description: message,
      });
      setLoading(null);
    }
  }

  function handleForgotPassword() {
    toast.add({
      type: "info",
      title: "Forgot password",
      description: "Password reset is not available yet.",
    });
  }

  return (
    <div className="mx-auto my-10 flex w-full max-w-md flex-col gap-6 px-5">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Login</CardTitle>
          <CardDescription>
            Welcome back to BookNook. Sign in to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailLogin} noValidate>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </Field>

              <Field>
                <div className="flex items-center justify-between gap-3">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </Field>

              {justRegistered ? (
                <p
                  className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-400"
                  role="status"
                >
                  Account created successfully. Please log in.
                </p>
              ) : null}

              {error ? <FieldError>{error}</FieldError> : null}

              <Field>
                <Button type="submit" disabled={Boolean(loading)}>
                  {loading === "email" ? <Spinner className="size-4" /> : null}
                  {loading === "email" ? "Logging in…" : "Login"}
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link href={registerHref(nextPath)}>Register</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>

          <div className="relative my-5">
            <Separator />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
              or
            </span>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={Boolean(loading)}
            onClick={handleGoogleLogin}
          >
            {loading === "google" ? (
              <Spinner className="size-4" />
            ) : (
              <GoogleIcon />
            )}
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}
