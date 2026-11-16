import { cn } from "cn";

import { SectionHeading } from "@/components/layout/section-heading";

export function PageShell({
  title,
  description,
  actions,
  children,
  className,
}) {
  return (
    <section
      className={cn(
        "relative isolate mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-56 bg-gradient-to-b from-accent/50 via-accent/15 to-transparent"
      />

      <SectionHeading
        as="h1"
        title={title}
        description={description}
        actions={actions}
        titleClassName="text-3xl leading-tight sm:text-4xl"
      />

      <div className="mt-8 sm:mt-10">{children}</div>
    </section>
  );
}
