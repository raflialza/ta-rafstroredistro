import { Suspense } from "react";
import { ProductList } from "@/components/product/product-list";
import { ProductListSkeleton } from "@/components/product/product-skeleton";
import { AuthButton } from "@/components/auth-button";
import { CategoryList } from "@/components/category/category-list";
import { CategorySkeleton } from "@/components/category/category-skeleton";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-10 items-center">
        {/* Navigasi Atas Sederhana */}
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-bold text-lg tracking-wider uppercase">
              RAFSTROREDISTRO
            </div>
            <Suspense>
              <AuthButton />
            </Suspense>
          </div>
        </nav>

        {/* Konten Utama */}
        <div className="flex flex-col gap-10 mb-10 max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Shop by Category
            </h1>
            <p className="text-muted-foreground text-lg">
              Find the latest distro drops and exclusive collections.
            </p>
          </div>

          {/* Suspense boundary will show the skeleton until CategoryList finishes fetching */}
          <Suspense fallback={<CategorySkeleton />}>
            <CategoryList />
          </Suspense>
        </div>

        <div className="flex-1 w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex flex-col gap-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Koleksi Terbaru
              </h1>
              <p className="text-muted-foreground text-lg">
                Temukan *sneakers* dan *apparel* paling tren minggu ini.
              </p>
            </div>

            {/* Suspense boundary akan menampilkan skeleton sampai ProductList selesai memuat data */}
            <Suspense fallback={<ProductListSkeleton />}>
              <ProductList />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
