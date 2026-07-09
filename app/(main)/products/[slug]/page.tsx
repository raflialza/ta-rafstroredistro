import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { ProductActions } from "@/components/product/product-actions";

// 1. Ubah tipe params menjadi Promise
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // 2. WAJIB: Await params sebelum mengambil nilainya
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const supabase = await createClient();

  // 3. Gunakan 'slug' yang sudah di-resolve ke database
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  // Jika produk benar-benar tidak ada di database
  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <h1 className="text-3xl font-bold">Produk tidak ditemukan</h1>
        <p className="text-gray-500">
          Cek kembali URL atau kembali ke halaman produk.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 md:gap-12 p-4 md:p-8 max-w-7xl mx-auto w-full">
      {/* KOLOM KIRI: GAMBAR PRODUK */}
      <div className="w-full md:w-1/2">
        <div className="relative md:sticky md:top-24 w-full aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-md">
          <Image
            src={product.image_url || product.imageUrl || "/placeholder.jpg"}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
      </div>

      {/* KOLOM KANAN: DETAIL & INTERAKSI */}
      <div className="w-full md:w-1/2 flex flex-col gap-6 pt-4 md:pt-0">
        {/* Judul & Harga */}
        <div>
          <h1 className="text-3xl md:text-5xl font-black uppercase italic mb-2 tracking-tight">
            {product.name}
          </h1>
          <p className="text-3xl font-bold text-gray-900">
            Rp {product.price?.toLocaleString("id-ID")}
          </p>
        </div>

        {/* Deskripsi */}
        <div className="prose max-w-none text-gray-600 text-base md:text-lg">
          <p>{product.description || "Deskripsi produk belum tersedia."}</p>
        </div>

        {/* INTEGRASI KOMPONEN KERANJANG */}
        <div className="-mt-4">
          <ProductActions productId={product.id} />
        </div>

        {/* Info Pengiriman */}
        <div className="bg-gray-50 rounded-2xl p-5 mt-2 flex flex-col gap-4 text-sm font-medium text-gray-700 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
              ✓
            </div>
            <span>100% Original & Authentic Guaranteed</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
              🚚
            </div>
            <span>Pengiriman Ekstra Cepat (1-3 hari kerja)</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center shrink-0">
              🔄
            </div>
            <span>Garansi Tukar Ukuran 7 Hari (S&K Berlaku)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
