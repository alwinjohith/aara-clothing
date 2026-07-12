import { Skeleton } from "@/components/ui/skeleton";

export default function CustomersLoading() {
  return (
    <div className="space-y-4 p-4 sm:space-y-6 sm:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="flex size-10 shrink-0 items-center justify-center rounded-xl" />
          <div>
            <Skeleton className="h-6 w-32 rounded-lg" />
            <Skeleton className="mt-1.5 h-4 w-48 rounded-lg" />
          </div>
        </div>
        <Skeleton className="h-9 w-32 rounded-xl" />
      </div>

      <div className="rounded-2xl border border-border/50 bg-card">
        <div className="border-b border-border/30 p-3 sm:p-4">
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
        <div className="p-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`flex h-14 items-center border-b border-border/20 px-3 sm:px-4 ${i % 2 === 1 ? "bg-muted/5" : ""}`}
            >
              <Skeleton className="h-4 w-32 rounded-lg" />
              <div className="ml-auto flex items-center gap-2">
                <Skeleton className="h-4 w-24 rounded-lg" />
                <Skeleton className="h-4 w-16 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
