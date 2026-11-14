import { cn } from "cn";

import { Reveal } from "@/components/layout/reveal";

/**
 * Shared heading block for page and section intros. Keeping this in one place
 * keeps the eyebrow, title and paragraph typography identical everywhere.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  actions,
  as: Heading = "h2",
  className,
  titleClassName,
  descriptionClassName,
}) {
  return (
    <Reveal y={16}>
      <div
        className={cn(
          "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
          className
        )}
      >
        <div className="min-w-0 max-w-2xl">
          {eyebrow ? (
            <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
              {eyebrow}
            </p>
          ) : null}

          <Heading
            className={cn(
              "font-heading font-semibold tracking-tight text-balance",
              eyebrow ? "mt-2" : null,
              titleClassName ?? "text-2xl leading-tight sm:text-3xl"
            )}
          >
            {title}
          </Heading>

          {description ? (
            <p
              className={cn(
                "mt-3 max-w-2xl text-base leading-7 text-pretty text-muted-foreground",
                descriptionClassName
              )}
            >
              {description}
            </p>
          ) : null}
        </div>

        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {actions}
          </div>
        ) : null}
      </div>
    </Reveal>
  );
}
