import Image from "next/image";

// Sesuaikan interface ini dengan tipe data product di database Supabase kamu
interface ProductProps {
  product: {
    id: string;
    name: string;
    price: number;
    description?: string;
    image_url?: string;
    imageUrl?: string;
  };
}

export default function ProductDetail({ product }: ProductProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 p-4 md:p-8 max-w-7xl mx-auto">
      {/* 
        BAGIAN KIRI: GAMBAR PRODUK 
        KUNCI PERBAIKAN: 
        1. 'relative' untuk HP (gambar tidak melayang/menutupi).
        2. 'md:sticky md:top-24' untuk Desktop (gambar menempel saat di-scroll).
        3. 'h-fit' memastikan bungkus gambar tidak memanjang ke bawah menutupi teks.
      */}
      <div className="relative w-full md:sticky md:top-24 h-fit">
        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100 border shadow-sm">
          <Image
            src={product.imageUrl || product.image_url || "/placeholder.jpg"}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority // priority mempercepat pemuatan gambar utama
          />
        </div>
      </div>

      {/* BAGIAN KANAN: INFORMASI PRODUK & TOMBOL */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black uppercase italic mb-2 tracking-tight">
            "{product.name}"
          </h1>
          <p className="text-3xl font-bold text-gray-900">
            Rp {product.price?.toLocaleString("id-ID")}
          </p>
        </div>

        {/* Deskripsi Produk */}
        <div className="prose max-w-none text-gray-600 text-base md:text-lg">
          <p>{product.description || "Deskripsi produk belum tersedia."}</p>
        </div>

        {/* Pemilihan Ukuran (Jika Ada) */}
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

        {/* Tombol Tambah ke Keranjang */}
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

        {/* Info Tambahan (Kepercayaan Pelanggan) */}
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
