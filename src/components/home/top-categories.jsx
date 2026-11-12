import Link from "next/link";
import {
  ArrowRightIcon,
  BrainIcon,
  HeartIcon,
  RocketIcon,
  SearchIcon,
  SparklesIcon,
  UserRoundIcon,
} from "lucide-react";
import { cn } from "cn";

import { buttonVariants } from "@/components/ui/button";

const categories = [
  {
    name: "Fiction",
    description: "Stories that stay with you",
    icon: SparklesIcon,
    className: "from-violet-500/15 to-indigo-500/5",
  },
  {
    name: "Mystery",
    description: "Clues, twists, and late nights",
    icon: SearchIcon,
    className: "from-slate-500/15 to-zinc-500/5",
  },
  {
    name: "Romance",
    description: "Love stories worth sharing",
    icon: HeartIcon,
    className: "from-rose-500/15 to-pink-500/5",
  },
  {
    name: "Science Fiction",
    description: "Other worlds and big ideas",
    icon: RocketIcon,
    className: "from-cyan-500/15 to-sky-500/5",
  },
  {
    name: "Self Help",
    description: "Small changes, better days",
    icon: BrainIcon,
    className: "from-amber-500/15 to-orange-500/5",
  },
  {
    name: "Biography",
    description: "Real lives, remarkable journeys",
    icon: UserRoundIcon,
    className: "from-emerald-500/15 to-teal-500/5",
  },
];

export function TopCategories() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary">Explore by mood</p>
          <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            Top Categories
          </h2>
          <p className="mt-2 text-muted-foreground">
            Start with a feeling and let the shelves point you toward your next
            read.
          </p>
        </div>
        <Link
          href="/all-books"
          className={buttonVariants({ variant: "ghost" })}
        >
          View all books
          <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.name}
            href="/all-books"
            className={cn(
              "group flex items-center gap-4 rounded-2xl border bg-gradient-to-br p-5 transition-all hover:-translate-y-0.5 hover:shadow-sm",
              category.className
            )}
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-background/80 text-foreground shadow-sm">
              <category.icon className="size-5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block font-heading text-base font-semibold">
                {category.name}
              </span>
              <span className="mt-0.5 block text-sm text-muted-foreground">
                {category.description}
              </span>
            </span>
            <ArrowRightIcon
              className="ml-auto size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
