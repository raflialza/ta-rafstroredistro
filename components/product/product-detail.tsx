import Image from "next/image";

export function ProductDetail({ product }: { product: any }) {
  return (
    // Menggunakan grid: 1 kolom di HP, 2 kolom di Desktop (md)
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 md:p-8">
      {/* KIRI: Container Gambar */}
      {/* 'relative' pada mobile membuat gambar ikut scroll normal */}
      {/* 'md:sticky md:top-20' membuat gambar diam di samping saat desktop di-scroll */}
      <div className="relative md:sticky md:top-20 w-full aspect-square overflow-hidden rounded-xl bg-gray-100">
        <Image
          src={product.image_url || "/placeholder.jpg"}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {/* KANAN: Informasi Produk */}
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-2xl font-semibold text-gray-800">
          Rp {product.price?.toLocaleString("id-ID")}
        </p>

        {/* Deskripsi & Konten Lainnya */}
        <div className="prose max-w-none">
          <p>{product.description}</p>
        </div>

        {/* Area Tombol Checkout/Cart */}
        <div className="mt-6">
          {/* Tambahkan komponen keranjang atau ukuran di sini */}
        </div>
      </div>
    </div>
  );
}
