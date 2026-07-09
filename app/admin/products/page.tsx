import { createClient } from "@/lib/supabase/server";
import { ProductsTable } from "./products-table";

export default async function AdminProductsPage() {
  const supabase = await createClient();

  // Menarik semua data produk dari database, diurutkan dari yang terbaru
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-black tracking-tight uppercase italic">
          Kelola Produk
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Tambah, pantau, dan hapus katalog sepatu Rafstore Distro.
        </p>
      </div>

      {/* Melempar data produk ke komponen Tabel (Client) */}
      <ProductsTable initialProducts={products || []} />
    </div>
  );
}
