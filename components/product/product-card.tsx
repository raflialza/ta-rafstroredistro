import Image from "next/image";
import Link from "next/link"; // 1. Pastikan import Link ada

interface Product {
  id: string;
  name: string;
  slug: string; // Pastikan ada slug untuk link
  price: number;
  imageUrl: string;
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
    <div className="flex flex-col h-full border rounded-lg overflow-hidden shadow-sm bg-white hover:shadow-md transition-shadow">
      {/* 2. Bungkus konten di sini dengan Link */}
      <Link
        href={`/products/${product.slug}`}
        className="flex flex-col flex-grow"
      >
        <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
          <Image
            src={product.imageUrl || "/placeholder.jpg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold truncate mb-1">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Rp {product.price.toLocaleString("id-ID")}
          </p>
        </div>
      </Link>

      {/* 3. Tombol tetap di luar Link agar tidak memicu navigasi saat ditekan */}
      <div className="p-4 pt-0 mt-auto">
        {onAddToCart && (
          <button
            onClick={(e) => {
              e.preventDefault(); // Mencegah navigasi saat tombol diklik
              onAddToCart(product);
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors text-sm font-medium"
          >
            Tambah ke Keranjang
          </button>
        )}
      </div>
    </div>
  );
}
