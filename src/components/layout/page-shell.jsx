import { cn } from "cn";

export function PageShell({ title, description, children, className }) {
  return (
    <section
      className={cn(
        "mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8",
        className
      )}
    >
      <div className="max-w-2xl">
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="mt-8">{children}</div>
    </section>
  );
}
