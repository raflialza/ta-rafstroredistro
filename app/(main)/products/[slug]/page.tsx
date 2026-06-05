import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ProductActions } from "@/components/product/product-actions";

export default async function ProductDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const supabase = await createClient();

  // Tarik data sepatu berdasarkan URL (slug)
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", params.slug)
    .single();

  // Jika tidak ketemu, munculkan halaman 404
  if (!product) {
    notFound();
  }

  const formatIDR = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-6xl">
      <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* --- KIRI: GAMBAR SEPATU --- */}
        <div className="bg-muted/30 rounded-[2.5rem] p-8 md:p-12 flex items-center justify-center sticky top-28 border">
          <div className="relative w-full aspect-square max-w-md mx-auto">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-contain mix-blend-multiply drop-shadow-2xl hover:scale-110 transition-transform duration-500 ease-out"
              priority // Prioritaskan pemuatan gambar ini
            />
          </div>
        </div>

        {/* --- KANAN: DETAIL PRODUK --- */}
        <div className="flex flex-col pt-4">
          <p className="text-red-600 font-bold uppercase tracking-[0.2em] mb-2 text-sm">
            {product.brand || "VANS ORIGINAL"}
          </p>

          <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-6 uppercase leading-none">
            {product.name}
          </h1>

          <div className="flex items-end gap-4 mb-8 pb-8 border-b">
            <span className="text-4xl font-black text-foreground">
              {formatIDR(product.price)}
            </span>
            {product.original_price && (
              <span className="text-xl text-muted-foreground line-through mb-1">
                {formatIDR(product.original_price)}
              </span>
            )}
          </div>

          <div className="prose prose-sm md:prose-base text-muted-foreground/80 leading-relaxed">
            <p>
              {product.description ||
                "Sepatu original dengan desain klasik yang tidak pernah lekang oleh waktu. Dibuat dengan material berkualitas tinggi untuk kenyamanan maksimal sepanjang hari. Sangat cocok untuk gaya kasual, nongkrong, maupun aktivitas berat seperti skateboarding."}
            </p>
          </div>

          {/* 👇 Panggil komponen interaktif di sini 👇 */}
          <ProductActions productId={product.id} />

          {/* Fitur Tambahan Pemanis E-Commerce */}
          <div className="mt-12 bg-zinc-50 p-6 rounded-2xl space-y-4 text-sm font-medium border text-foreground/80">
            <div className="flex items-center gap-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 text-lg">
                ✓
              </span>
              <span>100% Original & Authentic Guaranteed</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-lg">
                🚚
              </span>
              <span>Pengiriman Ekstra Cepat (1-3 hari kerja)</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-700 text-lg">
                🔄
              </span>
              <span>Garansi Tukar Ukuran 7 Hari (S&K Berlaku)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
