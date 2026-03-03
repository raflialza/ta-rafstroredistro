export function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 animate-pulse">
      {/* Gambar Produk Skeleton */}
      <div className="aspect-square w-full bg-muted rounded-xl" />

      {/* Detail Informasi Skeleton */}
      <div className="flex flex-col space-y-6 pt-4">
        <div className="space-y-3">
          <div className="h-4 w-24 bg-muted rounded-md" /> {/* Brand */}
          <div className="h-8 w-3/4 bg-muted rounded-md" /> {/* Judul */}
          <div className="h-6 w-1/3 bg-muted rounded-md mt-4" /> {/* Harga */}
        </div>

        <div className="space-y-4">
          <div className="h-4 w-full bg-muted rounded-md" />{" "}
          {/* Deskripsi baris 1 */}
          <div className="h-4 w-5/6 bg-muted rounded-md" />{" "}
          {/* Deskripsi baris 2 */}
          <div className="h-4 w-4/6 bg-muted rounded-md" />{" "}
          {/* Deskripsi baris 3 */}
        </div>

        <div className="pt-6 flex gap-4">
          <div className="h-12 w-full bg-muted rounded-md" />{" "}
          {/* Tombol Add to Cart */}
        </div>
      </div>
    </div>
  );
}
