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
    // Gunakan flex-col (atas-bawah) di HP, dan md:flex-row (kiri-kanan) di Desktop
    <div className="flex flex-col md:flex-row gap-8 md:gap-12 p-4 md:p-8 max-w-7xl mx-auto w-full">
      {/* 
        =========================================
        KOLOM KIRI: GAMBAR PRODUK
        =========================================
      */}
      <div className="w-full md:w-1/2">
        {/* 
          Di HP: 'relative' (diam mengikuti scroll normal)
          Di Laptop: 'md:sticky md:top-24' (baru boleh menempel/melayang)
        */}
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

      {/* 
        =========================================
        KOLOM KANAN: DETAIL & TOMBOL
        =========================================
      */}
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

        {/* Pilihan Ukuran */}
        <div>
          <h3 className="font-semibold mb-3 text-sm tracking-widest text-gray-500 uppercase">
            PILIH UKURAN
          </h3>
          <div className="flex flex-wrap gap-3">
            {["39", "40", "41", "42", "43", "44"].map((size) => (
              <button
                key={size}
                className="border-2 border-gray-200 rounded-lg px-6 py-3 font-semibold hover:border-black hover:bg-black hover:text-white transition-all"
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Tombol Keranjang */}
        <div className="mt-4">
          <button className="w-full bg-[#111111] hover:bg-black text-white py-4 rounded-xl flex items-center justify-center gap-3 font-bold text-lg transition-all shadow-md active:scale-[0.98]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
            Tambah ke Keranjang
          </button>
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
