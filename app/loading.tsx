export default function Loading() {
  return (
    <div className="mx-auto max-w-[1500px] px-4 py-8 md:px-8">
      <div className="h-8 w-48 animate-pulse rounded bg-stone-300/70" />
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-lg border border-stone-300/70 bg-[#fbf3e7]/70">
            <div className="aspect-[2/3] animate-pulse bg-stone-300/70" />
            <div className="space-y-2 p-3">
              <div className="h-4 w-3/4 animate-pulse rounded bg-stone-300/70" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-stone-300/70" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
