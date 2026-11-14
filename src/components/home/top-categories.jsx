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

import { Reveal } from "@/components/layout/reveal";
import { SectionHeading } from "@/components/layout/section-heading";
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
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <SectionHeading
        eyebrow="Explore by mood"
        title="Top Categories"
        description="Start with a feeling and let the shelves point you toward your next read."
        actions={
          <Link href="/books" className={buttonVariants({ variant: "ghost" })}>
            View all books
            <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
          </Link>
        }
      />

      <div className="mt-10 grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, index) => (
          <Reveal
            key={category.name}
            className="h-full"
            delay={(index % 3) * 0.07}
            amount={0.3}
          >
            <Link
              href="/books"
              className={cn(
                "group flex h-full items-center gap-4 rounded-2xl border bg-gradient-to-br p-5 transition-all outline-none hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50",
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
                <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                  {category.description}
                </span>
              </span>
              <ArrowRightIcon
                className="ml-auto size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
