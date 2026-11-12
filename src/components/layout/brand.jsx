import Link from "next/link";
import { BookOpenIcon } from "lucide-react";
import { cn } from "cn";

export function Brand({ className, href = "/", onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
    >
      <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-sm transition-transform group-hover:-rotate-3">
        <BookOpenIcon className="size-5" aria-hidden="true" />
      </span>
      <span className="font-heading text-xl font-semibold tracking-tight">
        BookNook
      </span>
    </Link>
  );
}
