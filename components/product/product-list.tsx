import { ProductCard, type Product } from "./product-card";

// TODO: Ganti ini dengan query fetch ke Supabase
async function getProducts(): Promise<Product[]> {
  // Simulasi loading selama 2 detik untuk melihat efek Skeleton
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return [
    {
      id: "1",
      brand: "New Balance",
      name: "New Balance 204L Pastel Pink",
      price: 2290000,
      imageUrl: "/1.jpg", // Ganti dengan URL asli
      slug: "new-balance-204l-pastel-pink",
    },
    {
      id: "2",
      brand: "New Balance",
      name: "New Balance 1906L Ice Wine Pink Taffy",
      price: 2410000,
      imageUrl: "/2.webp",
      slug: "new-balance-1906l-ice-wine",
    },
    {
      id: "3",
      brand: "Adidas",
      name: "Adidas Gazelle Indoor Bad Bunny Wonder Clay",
      price: 2700000,
      imageUrl: "/3.jpg",
      slug: "adidas-gazelle-indoor-bad-bunny",
    },
    {
      id: "4",
      brand: "Nike",
      name: "Nike V2K RunPink Foam Arctic Pink (Women's)",
      price: 1830000,
      imageUrl: "/4.jpg",
      slug: "nike-v2k-run-pink",
    },
    {
      id: "5",
      brand: "Nike",
      name: "Nike P-6000 White Elemental Pink Metallic Silver (Women's)",
      price: 1160000,
      originalPrice: 1729000, // Menampilkan harga coret
      imageUrl: "/5.webp",
      slug: "nike-p6000-white-elemental",
    },
    {
      id: "6",
      brand: "Nike",
      name: "Nike P-6000 White Elemental Pink Metallic Silver (Women's)",
      price: 1160000,
      originalPrice: 1729000, // Menampilkan harga coret
      imageUrl: "/6.webp",
      slug: "nike-p6000-white-elemental",
    },
    {
      id: "7",
      brand: "Nike",
      name: "Nike P-6000 White Elemental Pink Metallic Silver (Women's)",
      price: 1160000,
      originalPrice: 1729000, // Menampilkan harga coret
      imageUrl: "/7.webp",
      slug: "nike-p6000-white-elemental",
    },
    {
      id: "8",
      brand: "Nike",
      name: "Nike P-6000 White Elemental Pink Metallic Silver (Women's)",
      price: 1160000,
      originalPrice: 1729000, // Menampilkan harga coret
      imageUrl: "/8.jpg",
      slug: "nike-p6000-white-elemental",
    },
    {
      id: "9",
      brand: "Nike",
      name: "Nike P-6000 White Elemental Pink Metallic Silver (Women's)",
      price: 1160000,
      originalPrice: 1729000, // Menampilkan harga coret
      imageUrl: "/9.jpg",
      slug: "nike-p6000-white-elemental",
    },
  ];
}

export async function ProductList() {
  const products = await getProducts();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
