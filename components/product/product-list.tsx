import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "./product-card";

export async function ProductList() {
  const supabase = await createClient();
  const { data: dbProducts } = await supabase.from("products").select("*");

  // Format the data so your ProductCard understands it
  const products =
    dbProducts?.map((p) => ({
      id: p.id,
      brand: p.brand,
      name: p.name,
      slug: p.slug,
      price: p.price,
      originalPrice: p.original_price, // mapping from DB to frontend
      imageUrl: p.image_url, // mapping from DB to frontend
    })) || [];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
