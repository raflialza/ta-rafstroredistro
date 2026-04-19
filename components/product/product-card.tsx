import Link from "next/link";
import Image from "next/image";
import { ImageIcon } from "lucide-react"; // Import ikon untuk fallback

export interface Product {
  id: string;
  brand: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string | null; // Ubah tipe data agar mengizinkan null atau kosong
  slug: string;
}

export function ProductCard({ product }: { product: Product }) {
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
      <div className="relative aspect-square w-full bg-muted/40 rounded-lg overflow-hidden flex items-center justify-center transition-transform group-hover:scale-[1.02]">
        {/* Pengecekan: Jika ada imageUrl, tampilkan gambar. Jika tidak, tampilkan fallback */}
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-contain p-4 mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground opacity-50 transition-opacity group-hover:opacity-80">
            <ImageIcon className="h-12 w-12 mb-2" strokeWidth={1.5} />
            <span className="text-[10px] font-semibold uppercase tracking-widest">
              Belum Ada Gambar
            </span>
          </div>
        )}
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
