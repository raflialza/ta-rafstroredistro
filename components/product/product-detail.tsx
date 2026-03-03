import { Product } from "./product-card"; // Menggunakan interface dari langkah sebelumnya
import { Button } from "@/components/ui/button";

// TODO: Ganti dengan fetch asli ke Supabase berdasarkan slug
async function getProductBySlug(slug: string): Promise<Product | null> {
  // Simulasi loading 2 detik untuk melihat skeleton
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return {
    id: "1",
    brand: "New Balance",
    name: "New Balance 204L Pastel Pink",
    price: 2290000,
    imageUrl: "https://via.placeholder.com/600x600?text=Shoe+1",
    slug: slug,
  };
}

export async function ProductDetail({ slug }: { slug: string }) {
  const product = await getProductBySlug(slug);

  if (!product) {
    return <div>Produk tidak ditemukan.</div>;
  }

  const formatIDR = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
      {/* Container Gambar */}
      <div className="aspect-square w-full bg-[#f8f9fa] rounded-xl overflow-hidden flex items-center justify-center p-8">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="object-contain w-full h-full mix-blend-multiply"
        />
      </div>

      {/* Container Detail */}
      <div className="flex flex-col pt-4">
        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          {product.brand}
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          {product.name}
        </h1>

        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl font-bold text-[#10b981]">
            {formatIDR(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-lg font-medium text-muted-foreground line-through decoration-muted-foreground/50">
              {formatIDR(product.originalPrice)}
            </span>
          )}
        </div>

        <p className="text-muted-foreground mb-8 leading-relaxed">
          Ini adalah deskripsi produk tiruan. Di sini kamu bisa menjelaskan
          detail material, ukuran, atau cerita di balik perilisan produk ini.
          Sepatu ini sangat nyaman digunakan untuk gaya kasual sehari-hari.
        </p>

        <div className="mt-auto">
          <Button size="lg" className="w-full text-base font-semibold">
            Tambah ke Keranjang
          </Button>
        </div>
      </div>
    </div>
  );
}
