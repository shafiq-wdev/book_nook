
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
  BookOpenIcon,
  SparklesIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { useAuth } from "@/components/auth/auth-provider";
import { Brand } from "@/components/layout/brand";
import { ThemeToggle } from "@/components/layout/theme-toggle";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

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
  { href: "/books", label: "All Books" },
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

// Desktop Navigation Link
function NavLink({ href, label, active }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {label}

      {active && (
        <span className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 translate-y-1 rounded-full bg-primary" />
      )}
    </Link>
  );
}

// User Profile Menu
function UserMenu({ user, onLogout }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open user menu"
        className="group flex items-center gap-2 rounded-full border border-border/70 bg-background/70 p-1 pr-3 shadow-sm transition-all duration-300 hover:border-primary/40 hover:bg-muted/70 focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Avatar className="size-9 border-2 border-primary/20">
          {user.image ? (
            <AvatarImage src={user.image} alt={user.name} />
          ) : null}

          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>

        <span className="hidden max-w-24 truncate text-sm font-semibold sm:block">
          {user.name}
        </span>

        <ChevronDownIcon className="size-4 text-muted-foreground transition-transform duration-300 group-data-[popup-open]:rotate-180" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={12}
        className="w-64 rounded-2xl border-border/70 p-2 shadow-xl"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="p-2">
            <div className="flex items-center gap-3">
              <Avatar className="size-11 border border-primary/20">
                {user.image ? (
                  <AvatarImage src={user.image} alt={user.name} />
                ) : null}

                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {user.name}
                </p>
                <p className="truncate text-xs font-normal text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="my-2" />

          <DropdownMenuItem
            render={<Link href="/profile" />}
            className="cursor-pointer gap-3 rounded-lg py-2.5"
          >
            <CircleUserIcon className="size-4 text-muted-foreground" />
            My Profile
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-2" />

          <DropdownMenuItem
            variant="destructive"
            onClick={onLogout}
            className="cursor-pointer gap-3 rounded-lg py-2.5"
          >
            <LogOutIcon className="size-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Mobile Navigation
function MobileNavLink({ href, label, active, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
        active
          ? "bg-primary/10 text-primary shadow-sm"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {label}

      {active && (
        <span className="size-1.5 rounded-full bg-primary" />
      )}
    </Link>
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
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">

      <div className="mx-auto flex h-[76px] w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

        {/* Brand */}
        <div className="shrink-0">
          <Brand />
        </div>

        {/* Desktop Navigation */}
        <nav
          aria-label="Main"
          className="hidden items-center gap-1 rounded-full border border-border/50 bg-muted/30 p-1 md:flex"
        >
          {links.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              active={isLinkActive(pathname, link.href)}
            />
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex shrink-0 items-center gap-2">

          <ThemeToggle />

          {/* Desktop Authentication */}
          <div className="hidden items-center gap-3 md:flex">
            {!isLoaded ? (
              <Skeleton className="size-10 rounded-full" />
            ) : user ? (
              <UserMenu user={user} onLogout={logout} />
            ) : (
              <>
                <Link
                  href="/login"
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "rounded-full px-5"
                  )}
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25"
                >
                  <UserPlusIcon className="size-4" />
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className="size-10 rounded-xl border-border/70 md:hidden"
                  aria-label="Open navigation menu"
                />
              }
            >
              <MenuIcon className="size-5" />
            </SheetTrigger>

            <SheetContent
              side="right"
              className="flex w-[300px] flex-col border-l border-border/60 p-0 sm:w-80"
            >
              {/* Mobile Header */}
              <SheetHeader className="border-b border-border/60 p-5 text-left">
                <SheetTitle>
                  <Brand onClick={closeMobileMenu} />
                </SheetTitle>

                <SheetDescription className="text-xs">
                  Your personal space for discovering books.
                </SheetDescription>
              </SheetHeader>

              <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-5">

                {/* Navigation */}
                <div className="space-y-2">
                  <p className="px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    Navigation
                  </p>

                  <nav className="flex flex-col gap-1">
                    {links.map((link) => (
                      <MobileNavLink
                        key={link.href}
                        href={link.href}
                        label={link.label}
                        active={isLinkActive(pathname, link.href)}
                        onClick={closeMobileMenu}
                      />
                    ))}
                  </nav>
                </div>

                <Separator />

                {/* Mobile User Section */}
                {!isLoaded ? (
                  <Skeleton className="h-16 w-full rounded-xl" />
                ) : user ? (
                  <div className="space-y-3">

                    <p className="px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                      Account
                    </p>

                    <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-muted/40 p-3">
                      <Avatar className="size-11 border-2 border-primary/20">
                        {user.image ? (
                          <AvatarImage src={user.image} alt={user.name} />
                        ) : null}

                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">
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
                        "h-11 w-full justify-start rounded-xl gap-3"
                      )}
                    >
                      <CircleUserIcon className="size-4" />
                      My Profile
                    </Link>

                    <Button
                      variant="destructive"
                      className="h-11 w-full justify-start rounded-xl gap-3"
                      onClick={() => {
                        logout();
                        closeMobileMenu();
                      }}
                    >
                      <LogOutIcon className="size-4" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">

                    <p className="px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                      Welcome to Book Nook
                    </p>

                    <Link
                      href="/login"
                      onClick={closeMobileMenu}
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "h-11 w-full justify-center rounded-xl gap-2"
                      )}
                    >
                      <LogInIcon className="size-4" />
                      Login
                    </Link>

                    <Link
                      href="/register"
                      onClick={closeMobileMenu}
                      className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:opacity-90"
                    >
                      <UserPlusIcon className="size-4" />
                      Create Account
                    </Link>
                  </div>
                )}

                {/* Decorative Footer */}
                <div className="mt-auto rounded-2xl border border-primary/15 bg-primary/5 p-4">
                  <div className="mb-2 flex items-center gap-2 text-primary">
                    <BookOpenIcon className="size-4" />
                    <SparklesIcon className="size-4" />
                    <span className="text-xs font-bold">
                      Book Nook
                    </span>
                  </div>

                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Discover stories, explore knowledge, and find your next favorite book.
                  </p>
                </div>

              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
