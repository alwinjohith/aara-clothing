import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg bg-muted/50",
        "relative overflow-hidden",
        "after:absolute after:inset-0 after:-translate-x-full",
        "after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent",
        "after:[animation:shimmer_1.5s_infinite]",
        "dark:after:via-white/5",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
