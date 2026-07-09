import Image from "next/image";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  brand?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  return (
    // 'flex flex-col h-full' memastikan kartu memenuhi tinggi grid
    <div className="flex flex-col h-full border rounded-lg overflow-hidden shadow-sm bg-white hover:shadow-md transition-shadow">
      {/* 
        Container ini mengunci rasio gambar 1:1. 
        'aspect-square' mencegah gambar bergeser saat konten lain dimuat.
      */}
      <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
        <Image
          src={product.imageUrl || "/placeholder.jpg"}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Konten bawah menggunakan flex-grow agar tombol selalu rata bawah */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold truncate mb-1">{product.name}</h3>
        <p className="text-gray-600 mb-4 text-sm">
          Rp {product.price.toLocaleString("id-ID")}
        </p>

        {/* Tombol hanya muncul jika fungsi onAddToCart diberikan */}
        {onAddToCart && (
          <button
            onClick={() => onAddToCart(product)}
            className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors text-sm font-medium"
          >
            Tambah ke Keranjang
          </button>
        )}
      </div>
    </div>
  );
}
