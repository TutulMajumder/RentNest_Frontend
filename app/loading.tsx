import { House, KeyRound, Loader2 } from "lucide-react";

const GlobalLoading = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[60vh] flex-1 flex-col items-center justify-center gap-4"
    >
      <span className="relative flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <House className="size-6" strokeWidth={2.2} />
        <KeyRound
          className="absolute -right-1 -bottom-1 size-4 rounded-full bg-background p-0.5 text-primary"
          strokeWidth={2.5}
        />
        <span className="absolute inset-0 animate-ping rounded-xl bg-primary/30" />
      </span>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading RentNest…
      </div>

      <span className="sr-only">Loading, please wait</span>
    </div>
  );
};

export default GlobalLoading;
