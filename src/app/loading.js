import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 text-center"
      role="status"
      aria-live="polite"
    >
      <Spinner className="size-8" />
      <div>
        <p className="font-medium">Loading BookNook</p>
        <p className="text-sm text-muted-foreground">
          Fetching the latest page for you…
        </p>
      </div>
    </div>
  );
}