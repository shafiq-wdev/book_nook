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
  loginHref,
  loginHrefAfterRegister,
  sanitizeNextPath,
} from "@/lib/auth-redirect";
import { PASSWORD_HINT, getPasswordError } from "@/lib/password";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function RegisterFallback() {
  return (
    <div className="mx-auto my-10 w-full max-w-md px-5">
      <Card className="rounded-2xl">
        <CardContent className="grid gap-4 pt-6">
          <Skeleton className="mx-auto h-7 w-32" />
          <Skeleton className="mx-auto h-4 w-64 max-w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = sanitizeNextPath(searchParams.get("next"));

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  async function handleRegister(event) {
    event.preventDefault();
    setError(null);
    setPasswordError("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedImage = image.trim();

    if (!trimmedName) {
      setError("Please enter your name.");
      return;
    }

    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (trimmedImage) {
      try {
        const parsed = new URL(trimmedImage);

        if (!["http:", "https:"].includes(parsed.protocol)) {
          throw new Error("Unsupported protocol");
        }
      } catch {
        setError("Photo URL must be a valid http(s) URL.");
        return;
      }
    }

    const nextPasswordError = getPasswordError(password);

    if (nextPasswordError) {
      setPasswordError(nextPasswordError);
      return;
    }

    setLoading("email");

    try {
      const { error: signUpError } = await authClient.signUp.email({
        name: trimmedName,
        email: trimmedEmail,
        image: trimmedImage || undefined,
        password,
      });

      if (signUpError) {
        const message =
          signUpError.message || "Unable to create your account.";
        setError(message);
        toast.add({
          type: "error",
          title: "Registration failed",
          description: message,
        });
        return;
      }

      // Registration should not leave the user signed in.
      await authClient.signOut();

      router.replace(loginHrefAfterRegister(nextPath));
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong while signing up.";
      setError(message);
      toast.add({
        type: "error",
        title: "Registration failed",
        description: message,
      });
    } finally {
      setLoading(null);
    }
  }

  async function handleGoogleRegister() {
    setError(null);
    setLoading("google");

    try {
      const { error: socialError } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (socialError) {
        const message = describeGoogleAuthError(socialError);
        setError(message);
        toast.add({
          type: "error",
          title: "Google registration failed",
          description: message,
        });
        setLoading(null);
      }
    } catch (err) {
      const message = describeGoogleAuthError(err);
      setError(message);
      toast.add({
        type: "error",
        title: "Google registration failed",
        description: message,
      });
      setLoading(null);
    }
  }

  return (
    <div className="mx-auto my-10 flex w-full max-w-md flex-col gap-6 px-5">
      <Card className="rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>
            Create your BookNook account and start sharing books.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} noValidate>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Your name"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </Field>

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
                <FieldLabel htmlFor="image">Photo URL (optional)</FieldLabel>
                <Input
                  id="image"
                  type="url"
                  name="image"
                  placeholder="https://example.com/avatar.jpg"
                  autoComplete="photo"
                  value={image}
                  onChange={(event) => setImage(event.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  minLength={6}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);

                    if (passwordError) {
                      setPasswordError(getPasswordError(event.target.value));
                    }
                  }}
                  required
                />
                <FieldDescription>{PASSWORD_HINT}</FieldDescription>
                {passwordError ? (
                  <FieldError>{passwordError}</FieldError>
                ) : null}
              </Field>

              {error ? <FieldError>{error}</FieldError> : null}

              <Field>
                <Button type="submit" disabled={Boolean(loading)}>
                  {loading === "email" ? <Spinner className="size-4" /> : null}
                  {loading === "email" ? "Creating account…" : "Register"}
                </Button>
                <FieldDescription className="text-center">
                  Already have an account?{" "}
                  <Link href={loginHref(nextPath)}>Login</Link>
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
            onClick={handleGoogleRegister}
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

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterFallback />}>
      <RegisterForm />
    </Suspense>
  );
}
