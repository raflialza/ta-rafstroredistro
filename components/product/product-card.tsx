// components/product/product-card.tsx
import Image from "next/image";

// Sesuaikan interface ini dengan struktur data produk kamu
interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  onAddToCart: (product: any) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* 
        FIX: Container ini mengunci aspek rasio (kotak sempurna).
        'relative' dan 'aspect-square' mencegah gambar bergeser saat UI berubah.
      */}
      <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Konten bawah dengan flex-grow agar tombol selalu rata bawah */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold truncate">{product.name}</h3>
        <p className="text-gray-600 mb-4">
          Rp {product.price.toLocaleString("id-ID")}
        </p>

        {/* mt-auto memastikan tombol selalu berada di posisi paling bawah kartu */}
        <button
          onClick={() => onAddToCart(product)}
          className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors font-medium"
        >
          Tambah ke Keranjang
        </button>
      </div>
    </div>
  );
}
