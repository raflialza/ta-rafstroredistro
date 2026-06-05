import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "./product-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export async function ProductList({
  categoryId,
  isCarousel = false,
  limit = 10, // Default: Tampilkan 10 sepatu pertama
  searchQuery = "", // 👈 1. Tambahkan parameter searchQuery
}: {
  categoryId?: string | number;
  isCarousel?: boolean;
  limit?: number;
  searchQuery?: string; // 👈 Tambahkan tipenya di sini
} = {}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Ambil data dan urutkan dari yang terbaru
  let query = supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  // 👇 2. Logika Pencarian Supabase 👇
  if (searchQuery) {
    // ilike akan mencari produk yang namanya mirip/mengandung kata kunci (huruf besar/kecil diabaikan)
    query = query.ilike("name", `%${searchQuery}%`);
  }

  // Batasi jumlah produk yang ditarik dari database
  if (limit) {
    query = query.limit(limit);
  }

  const { data: dbProducts } = await query;

  // Format the data so your ProductCard understands it
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

  // Cek apakah jumlah produk yang didapat sama dengan batas limit.
  // Jika ya, berarti kemungkinan masih ada sisa produk di database.
  const hasMore = products.length === limit;

  return (
    <div className="flex flex-col items-center gap-10 w-full">
      {/* 3. Tampilan Grid Produk atau Pesan Tidak Ditemukan */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 w-full text-muted-foreground border-2 border-dashed rounded-xl">
          <span className="text-4xl mb-4 block">🔍</span>
          <p className="text-lg font-medium">
            Yahh, sepatu yang kamu cari tidak ditemukan.
          </p>
          <p className="text-sm">
            Coba gunakan kata kunci lain atau periksa ejaanmu.
          </p>
        </div>
      )}

      {/* Tombol Lihat Selengkapnya */}
      {hasMore && (
        <Button
          asChild
          variant="outline"
          size="lg"
          className="rounded-full px-8 border-black text-black hover:bg-black hover:text-white transition-all"
        >
          <Link
            // 4. Pastikan parameter pencarian tetap terbawa saat memuat lebih banyak produk
            href={`/?limit=${limit + 10}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}#products`}
            scroll={false} // Mencegah layar lompat ke atas saat diklik
          >
            Lihat Selengkapnya
          </Link>
        </Button>
      )}
    </div>
  );
}
