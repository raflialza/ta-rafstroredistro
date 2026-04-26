import { ProductList } from "@/components/product/product-list";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductListSkeleton } from "@/components/product/product-skeleton";

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  // 1. Ambil data kategori berdasarkan slug untuk mendapatkan ID-nya
  const { data: dbCategory, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  let category = dbCategory;

  // Fallback if data is missing or table not yet created
  if (!category || error) {
    const fallbacks = [
      {
        id: "mock1",
        name: "Vans Old Skool",
        slug: "old-skool",
        description: "The original Vans model featuring a minimalist, low-top design.",
      },
      {
        id: "mock2",
        name: "Vans Authentic",
        slug: "authentic",
        description: "An evolution of the Authentic, specifically designed by skaters.",
      },
      {
        id: "mock3",
        name: "Vans Era",
        slug: "era",
        description: "The first model to debut the iconic Sidestripe.",
      },
      {
        id: "mock4",
        name: "Vans Classic Slip-On",
        slug: "classic-slip-on",
        description: "The ultimate practical design, featuring a laceless upper with elastic side accents.",
      },
    ];
    
    category = fallbacks.find((c) => c.slug === slug);
  }

  // Jika kategori masih tidak ditemukan
  if (!category) {
    notFound();
  }

  return (
    <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-10">
        <div className="space-y-4">
          <h1 className="text-4xl font-black italic uppercase">
            Koleksi <span className="text-red-600">{category.name}</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            {category.description}
          </p>
        </div>

        <hr className="border-border" />

        {/* 2. Tampilkan daftar produk berdasarkan category_id */}
        <Suspense fallback={<ProductListSkeleton />}>
          <ProductList categoryId={category.id} isCarousel={false} />
        </Suspense>
      </div>
    </main>
  );
}
