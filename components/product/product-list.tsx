import { createClient } from "@/lib/supabase/server";
import ProductCard from "./product-card"; // IMPORT DIPERBAIKI (Tanpa kurung kurawal)
import Link from "next/link";
import { Button } from "@/components/ui/button";

export async function ProductList({
  categoryId,
  isCarousel = false,
  limit = 10,
  searchQuery = "",
}: {
  categoryId?: string | number;
  isCarousel?: boolean;
  limit?: number;
  searchQuery?: string;
} = {}) {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  if (searchQuery) {
    query = query.ilike("name", `%${searchQuery}%`);
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data: dbProducts } = await query;

  const products =
    (dbProducts as any[])?.map((p: any) => ({
      id: p.id,
      brand: p.brand,
      name: p.name,
      slug: p.slug,
      price: p.price,
      originalPrice: p.original_price,
      imageUrl: p.image_url,
    })) || [];

  const hasMore = products.length === limit;

  return (
    <div className="flex flex-col items-center gap-10 w-full">
      {products.length > 0 ? (
        // ITEMS-STRETCH memastikan semua kartu punya tinggi yang sama
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full items-stretch">
          {products.map((product: any) => (
            <div key={product.id} className="h-full">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 w-full text-muted-foreground border-2 border-dashed rounded-xl">
          <span className="text-4xl mb-4 block">🔍</span>
          <p className="text-lg font-medium">
            Yahh, produk yang kamu cari tidak ditemukan.
          </p>
        </div>
      )}

      {hasMore && (
        <Button
          asChild
          variant="outline"
          size="lg"
          className="rounded-full px-8 border-black text-black hover:bg-black hover:text-white transition-all"
        >
          <Link
            href={`/?limit=${limit + 10}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}#products`}
            scroll={false}
          >
            Lihat Selengkapnya
          </Link>
        </Button>
      )}
    </div>
  );
}
