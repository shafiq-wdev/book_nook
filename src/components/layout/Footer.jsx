import Link from "next/link";
import {
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  ArrowUpRightIcon,
  BookOpenIcon,
} from "lucide-react";

import { Brand } from "@/components/layout/brand";
import {
  FacebookLogo,
  GithubLogo,
  InstagramLogo,
  XLogo,
} from "@/components/layout/social-icons";

const exploreLinks = [
  { href: "/", label: "Home" },
  { href: "/books", label: "All Books" },
  { href: "/add-book", label: "Add a Book" },
  { href: "/my-books", label: "My Books" },
];

const socialLinks = [
  { href: "https://facebook.com/ShafiqulAlamCSE", label: "Facebook", icon: FacebookLogo },
  { href: "www.linkedin.com/in/shafiqtsc", label: "Linkedin", icon: InstagramLogo },
  { href: "https://github.com/shafiq-wdev", label: "GitHub", icon: GithubLogo },
];

const contactItems = [
  {
    href: "mailto:shafiq.tsc@gmail.com",
    label: "shafiq.tsc@gmail.com",
    icon: MailIcon,
  },
  {
    href: "mob:+8801712222143",
    label: "+ (880) 171-2222143",
    icon: PhoneIcon,
  },
];

export function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t bg-muted/30">
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 size-80 rounded-full bg-primary/5 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-32 size-80 rounded-full bg-primary/5 blur-3xl"
      />

      <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-10 lg:px-8">
        {/* Brand section */}
        <div className="lg:col-span-2">
          <Brand />

          <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">
            Discover your next favorite story, share the books you love, and
            connect with a community of readers. Every book has a story worth
            sharing.
          </p>

          <div className="mt-7 flex items-center gap-2">
            <BookOpenIcon className="size-4 text-primary" />
            <span className="text-xs font-medium tracking-wide text-muted-foreground">
              DISCOVER · READ · SHARE
            </span>
          </div>

          {/* Social links */}
          <ul className="mt-6 flex items-center gap-3">
            {socialLinks.map((social) => {
              const Icon = social.icon;

              return (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    title={social.label}
                    className="group inline-flex size-10 items-center justify-center rounded-full border bg-background text-muted-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-md"
                  >
                    <Icon className="size-4 transition-transform group-hover:scale-110" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Explore section */}
        <div>
          <h2 className="font-heading text-sm font-bold tracking-wide">
            Explore
          </h2>

          <div className="mt-2 h-0.5 w-8 rounded-full bg-primary" />

          <ul className="mt-6 space-y-3">
            {exploreLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  <span>{link.label}</span>
                  <ArrowUpRightIcon className="size-3 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact section */}
        <div>
          <h2 className="font-heading text-sm font-bold tracking-wide">
            Get in Touch
          </h2>

          <div className="mt-2 h-0.5 w-8 rounded-full bg-primary" />

          <ul className="mt-6 space-y-4">
            {contactItems.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="group inline-flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background transition-colors group-hover:border-primary/30 group-hover:bg-primary/10">
                      <Icon className="size-4" />
                    </span>
                    <span className="break-all">{item.label}</span>
                  </a>
                </li>
              );
            })}

            <li className="flex items-start gap-3 text-sm text-muted-foreground">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background">
                <MapPinIcon className="size-4" />
              </span>
              <span className="pt-1 leading-6">
                Govt. Technical School & College
                <br />
                Sher-e-Bangla Sarak, Jhenaidah
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="relative border-t bg-background/50">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
          <p className="text-xs text-muted-foreground">
            © 2026{" "}
            <span className="font-semibold text-foreground">BookNook</span>. All
            rights reserved.
          </p>

          <p className="text-xs text-muted-foreground">
            Made with <span className="text-primary">♥</span> for readers, by
            readers.
          </p>
        </div>
      </div>
    </footer>
  );
}
