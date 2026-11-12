import {
  BookOpenCheckIcon,
  HandshakeIcon,
  SearchIcon,
} from "lucide-react";

const steps = [
  {
    icon: SearchIcon,
    title: "Browse the shelves",
    description:
      "Explore the latest arrivals and find a book that catches your eye.",
  },
  {
    icon: HandshakeIcon,
    title: "Request a borrow",
    description:
      "Send a request to the owner and arrange a time to pick the book up.",
  },
  {
    icon: BookOpenCheckIcon,
    title: "Read and return",
    description:
      "Enjoy the story, then return it so the next reader can begin.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-y bg-muted/30">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary">Simple by design</p>
          <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            How Borrowing Works
          </h2>
          <p className="mt-2 text-muted-foreground">
            Three small steps keep books moving and stories shared.
          </p>
        </div>

        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="relative rounded-2xl border bg-background p-6"
            >
              <span
                className="absolute top-5 right-5 font-heading text-3xl font-semibold text-muted-foreground/20"
                aria-hidden="true"
              >
                0{index + 1}
              </span>
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <step.icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-heading text-lg font-semibold">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
