import { Suspense } from "react";
import { ProductList } from "@/components/product/product-list";
import { ProductListSkeleton } from "@/components/product/product-skeleton";
import { CategoryList } from "@/components/category/category-list";
import { CategorySkeleton } from "@/components/category/category-skeleton";
import { HeroSection } from "@/components/hero/hero-section";

// 1. Tambahkan props searchParams untuk membaca URL
export default async function Home(props: {
  searchParams: Promise<{ limit?: string }>;
}) {
  const searchParams = await props.searchParams;

  // 2. Baca batasan dari URL, jika baru pertama kali buka web, gunakan angka 10
  const currentLimit = searchParams.limit
    ? parseInt(searchParams.limit, 10)
    : 10;

  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-10 items-center">
        {/* Bagian Hero Banner */}
        <HeroSection />

        {/* Bagian Kategori (Tetap Sama) */}
        <div
          id="categories"
          className="flex flex-col gap-10 mt-8 mb-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 scroll-mt-24"
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Shop by Category
            </h2>
            <p className="text-muted-foreground text-lg">
              Find the latest distro drops and exclusive collections.
            </p>
          </div>

          <Suspense fallback={<CategorySkeleton />}>
            <CategoryList />
          </Suspense>
        </div>

        {/* Bagian Koleksi Terbaru */}
        <div
          id="products"
          className="flex-1 w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 scroll-mt-24"
        >
          <div className="flex flex-col gap-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Latest Collection
              </h2>
              <p className="text-muted-foreground text-lg">
                Find the latest sneaker drops of the week.
              </p>
            </div>

            <Suspense fallback={<ProductListSkeleton />}>
              {/* 3. Masukkan limit dan matikan isCarousel agar menjadi bentuk grid */}
              <ProductList isCarousel={false} limit={currentLimit} />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
