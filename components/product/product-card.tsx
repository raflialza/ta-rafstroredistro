import Link from "next/link";
import Image from "next/image";

export interface Product {
  id: string;
  brand: string;
  name: string;
  price: number;
  originalPrice?: number; // Opsional untuk produk diskon
  imageUrl: string;
  slug: string;
}

export function ProductCard({ product }: { product: Product }) {
  // Format angka ke format mata uang Rupiah
  const formatIDR = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col gap-3 cursor-pointer"
    >
      {/* Container Gambar */}
      <div className="relative aspect-square w-full bg-[#f8f9fa] rounded-lg overflow-hidden flex items-center justify-center p-4 transition-transform group-hover:scale-[1.02]">
        {/* Fallback image menggunakan warna jika gambar asli tidak ada */}
        <img
          src={product.imageUrl}
          alt={product.name}
          className="object-contain w-full h-full mix-blend-multiply"
        />
      </div>

      {/* Detail Produk */}
      <div className="flex flex-col space-y-1">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {product.brand}
        </span>
        <h3 className="text-sm font-semibold leading-tight line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 pt-1">
          <span className="text-sm font-bold text-[#10b981]">
            {formatIDR(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs font-medium text-muted-foreground line-through decoration-muted-foreground/50">
              {formatIDR(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
