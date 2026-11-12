"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  ChevronDownIcon,
  CircleUserIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  UserPlusIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { useAuth } from "@/components/auth/auth-provider";
import { Brand } from "@/components/layout/brand";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Separator } from "@/components/ui/separator";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/all-books", label: "All Books" },
];

const privateLinks = [
  { href: "/add-book", label: "Add Book" },
  { href: "/my-books", label: "My Books" },
  { href: "/my-borrows", label: "My Borrows" },
];

function getInitials(name) {
  return (
    name
      ?.split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "BN"
  );
}

function isLinkActive(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({ href, label, active }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative rounded-md px-3 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        active
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {label}
      {active ? (
        <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary" />
      ) : null}
    </Link>
  );
}


function UserMenu({ user, onLogout }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open user menu"
        className="group flex items-center gap-1.5 rounded-full border border-transparent p-0.5 outline-none transition-colors hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <Avatar>
          {user.image ? (
            <AvatarImage src={user.image} alt={user.name} />
          ) : null}
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>

        <ChevronDownIcon
          className="size-4 text-muted-foreground transition-transform group-data-[popup-open]:rotate-180"
          aria-hidden="true"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-2.5 p-1.5">
            <Avatar size="sm">
              {user.image ? (
                <AvatarImage src={user.image} alt={user.name} />
              ) : null}
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>

            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-foreground">
                {user.name}
              </span>
              <span className="block truncate text-xs font-normal text-muted-foreground">
                {user.email}
              </span>
            </span>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem render={<Link href="/profile" />}>
            <CircleUserIcon aria-hidden="true" />
            My Profile
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant="destructive"
            onClick={onLogout}
          >
            <LogOutIcon aria-hidden="true" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


export function Navbar() {
  const pathname = usePathname();
  const { user, isLoaded, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    ...publicLinks,
    ...(user ? privateLinks : []),
  ];

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Brand />

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              active={isLinkActive(pathname, link.href)}
            />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="md:hidden">
            {!isLoaded ? (
              <Skeleton className="size-8 rounded-full" />
            ) : user ? (
              <UserMenu user={user} onLogout={logout} />
            ) : null}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            {!isLoaded ? (
              <Skeleton className="size-8 rounded-full" />
            ) : user ? (
              <UserMenu user={user} onLogout={logout} />
            ) : (
              <>
                <Link
                  href="/login"
                  className={buttonVariants({ variant: "ghost" })}
                >
                  Login
                </Link>
                <Link href="/register" className={buttonVariants()}>
                  Register
                </Link>
              </>
            )}
          </div>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open navigation menu"
                />
              }
            >
              <MenuIcon aria-hidden="true" />
            </SheetTrigger>
            <SheetContent side="right" className="w-80 sm:max-w-sm">
              <SheetHeader className="border-b">
                <SheetTitle>
                  <Brand onClick={closeMobileMenu} />
                </SheetTitle>
                <SheetDescription className="sr-only">
                  BookNook navigation
                </SheetDescription>
              </SheetHeader>

              <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
                <nav aria-label="Mobile" className="flex flex-col gap-1">
                  {links.map((link) => {
                    const active = isLinkActive(pathname, link.href);

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={closeMobileMenu}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                          active
                            ? "bg-muted text-foreground"
                            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                        )}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>

                <Separator className="my-3" />

                {!isLoaded ? (
                  <Skeleton className="h-10 w-full rounded-lg" />
                ) : user ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 rounded-xl border bg-muted/40 p-3">
                      <Avatar>
                        {user.image ? (
                          <AvatarImage src={user.image} alt={user.name} />
                        ) : null}
                        <AvatarFallback>
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {user.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/profile"
                      onClick={closeMobileMenu}
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "w-full justify-start"
                      )}
                    >
                      <CircleUserIcon aria-hidden="true" />
                      My Profile
                    </Link>
                    <Button
                      variant="destructive"
                      className="w-full justify-start"
                      onClick={() => {
                        logout();
                        closeMobileMenu();
                      }}
                    >
                      <LogOutIcon aria-hidden="true" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/login"
                      onClick={closeMobileMenu}
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "w-full"
                      )}
                    >
                      <LogInIcon aria-hidden="true" />
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={closeMobileMenu}
                      className={cn(buttonVariants(), "w-full")}
                    >
                      <UserPlusIcon aria-hidden="true" />
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
