export default function ProductsLoading() {
  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center gap-3">
        <div className="size-10 animate-pulse rounded-xl bg-muted" />
        <div>
          <div className="h-6 w-32 animate-pulse rounded bg-muted" />
          <div className="mt-1 h-4 w-48 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 w-full animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    </div>
  );
}
