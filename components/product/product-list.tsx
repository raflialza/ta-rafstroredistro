import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "./product-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export async function ProductList({
  categoryId,
  isCarousel = false,
  limit = 10, // Default: Tampilkan 10 sepatu pertama
}: {
  categoryId?: string | number;
  isCarousel?: boolean;
  limit?: number;
} = {}) {
  const supabase = await createClient();

  // Ambil data dan urutkan dari yang terbaru
  let query = supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  // Batasi jumlah produk yang ditarik dari database
  if (limit) {
    query = query.limit(limit);
  }

  const { data: dbProducts } = await query;

  // Format the data so your ProductCard understands it
  const products =
    dbProducts?.map((p) => ({
      id: p.id,
      brand: p.brand,
      name: p.name,
      slug: p.slug,
      price: p.price,
      originalPrice: p.original_price,
      imageUrl: p.image_url,
    })) || [];

  // Cek apakah jumlah produk yang didapat sama dengan batas limit.
  // Jika ya, berarti kemungkinan masih ada sisa produk di database.
  const hasMore = products.length === limit;

  return (
    <div className="flex flex-col items-center gap-10 w-full">
      {/* Tampilan Grid Produk */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Tombol Lihat Selengkapnya */}
      {hasMore && (
        <Button
          asChild
          variant="outline"
          size="lg"
          className="rounded-full px-8 border-black text-black hover:bg-black hover:text-white transition-all"
        >
          <Link
            href={`/?limit=${limit + 10}#products`}
            scroll={false} // Mencegah layar lompat ke atas saat diklik
          >
            Lihat Selengkapnya
          </Link>
        </Button>
      )}
    </div>
  );
}
