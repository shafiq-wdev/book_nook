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
        "mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8",
        className
      )}
    >
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
