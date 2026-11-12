import Link from "next/link";
import {
  ArrowUpRightIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from "lucide-react";

import { Brand } from "@/components/layout/brand";

const exploreLinks = [
  { href: "/", label: "Home" },
  { href: "/all-books", label: "All Books" },
];

const socialLinks = [
  { href: "https://facebook.com", label: "Facebook" },
  { href: "https://instagram.com", label: "Instagram" },
  { href: "https://x.com", label: "X" },
  { href: "https://github.com", label: "GitHub" },
];

const contactItems = [
  {
    href: "mailto:hello@booknook.com",
    label: "hello@booknook.com",
    icon: MailIcon,
  },
  {
    href: "tel:+15550102030",
    label: "+1 (555) 010-2030",
    icon: PhoneIcon,
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-muted/30">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <Brand />
          <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
            A cozy corner for readers to share the books they love, borrow
            something new, and keep every story moving.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-full border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
              >
                {social.label}
                <ArrowUpRightIcon className="size-3" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-heading text-sm font-semibold">Explore</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {exploreLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-heading text-sm font-semibold">Contact</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {contactItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <item.icon className="size-4" aria-hidden="true" />
                  {item.label}
                </a>
              </li>
            ))}
            <li className="inline-flex items-start gap-2 text-muted-foreground">
              <MapPinIcon
                className="mt-0.5 size-4 shrink-0"
                aria-hidden="true"
              />
              <span>
                123 Library Lane
                <br />
                Reading, CA 90210
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© 2026 BookNook. All rights reserved.</p>
          <p>Made for readers, by readers.</p>
        </div>
      </div>
    </footer>
  );
}
