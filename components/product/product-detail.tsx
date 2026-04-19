import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductActions } from "./product-actions";
// 1. Import Supabase Client khusus untuk komponen server
import { createClient } from "@/lib/supabase/server"; // <-- Pastikan ini adalah client untuk server, bukan untuk client-side

interface ProductDetailProps {
  slug: string;
}

export async function ProductDetail({ slug }: ProductDetailProps) {
  // 2. Inisialisasi koneksi ke Supabase
  const supabase = await createClient();

  // 3. Ambil data asli dari tabel "products" berdasarkan slug
  const { data: product, error } = await supabase
    .from("products") // Pastikan nama tabel ini sesuai dengan yang ada di Supabasemu
    .select("*")
    .eq("slug", slug) // Cari produk dimana kolom 'slug' bernilai sama dengan parameter {slug}
    .single(); // Ambil satu data saja, bukan dalam bentuk array

  // Jika error dari database atau produk tidak ditemukan
  if (error || !product) {
    console.error("Error fetching product:", error);
    notFound();
  }

  // Format harga
  const formatIDR = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="grid md:grid-cols-2 gap-10 items-start">
      {/* Gambar Produk */}
      <div className="bg-[#f8f9fa] rounded-xl p-8 flex justify-center items-center relative aspect-square">
        {/* Catatan: Jika di Supabase nama kolom gambarmu adalah 'image_url', 
            ganti product.imageUrl di bawah ini menjadi product.image_url */}
        <img
          src={product.imageUrl || product.image_url}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply"
        />
      </div>

      {/* Info Produk */}
      <div className="flex flex-col gap-4">
        <h2 className="text-muted-foreground font-semibold tracking-widest uppercase">
          {product.brand}
        </h2>
        <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>

        <div className="flex items-center gap-4 mt-2">
          <span className="text-2xl font-bold text-[#10b981]">
            {formatIDR(product.price)}
          </span>
          {/* Catatan: Sama seperti gambar, jika di DB pakai 'original_price', ganti kode di bawah */}
          {(product.originalPrice || product.original_price) && (
            <span className="text-lg text-muted-foreground line-through">
              {formatIDR(product.originalPrice || product.original_price)}
            </span>
          )}
        </div>

        {/* Tombol Add to Cart & Pilihan Size */}
        {/* Pastikan product.id di bawah ini sesuai dengan primary key di Supabase-mu */}
        <ProductActions
          productId={product.id}
          availableSizes={[39, 40, 41, 42, 43]}
        />
      </div>
    </div>
  );
}
