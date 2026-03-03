export function ProductSkeleton() {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      {/* Box Gambar Skeleton */}
      <div className="aspect-square w-full bg-muted rounded-lg" />

      {/* Detail Skeleton */}
      <div className="flex flex-col space-y-2">
        <div className="h-3 w-1/3 bg-muted rounded-md" /> {/* Brand */}
        <div className="h-4 w-full bg-muted rounded-md" /> {/* Name line 1 */}
        <div className="h-4 w-4/5 bg-muted rounded-md" /> {/* Name line 2 */}
        <div className="h-4 w-1/2 bg-muted rounded-md mt-2" /> {/* Price */}
      </div>
    </div>
  );
}

export function ProductListSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
