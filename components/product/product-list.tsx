import { ProductCard, type Product } from "./product-card";

// TODO: Ganti ini dengan query fetch ke Supabase
async function getProducts(): Promise<Product[]> {
  // Simulasi loading selama 2 detik untuk melihat efek Skeleton
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return [
    {
      id: "1",
      brand: "Vans Authentic",
      name: "Vans Authentic (Maroon/Burgundy)",
      price: 2290000,
      imageUrl: "/1.jpg", // Ganti dengan URL asli
      slug: "vans-authentic-maroon-burgundy",
    },
    {
      id: "2",
      brand: "Vans Authentic",
      name: "Vans Authentic (Black/White)",
      price: 2410000,
      imageUrl: "/2.webp",
      slug: "vans-authentic-black-white",
    },
    {
      id: "3",
      brand: "Vans Authentic",
      name: "Vans Authentic (All Black)",
      price: 2700000,
      imageUrl: "/3.jpg",
      slug: "vans-authentic-all-black",
    },
    {
      id: "4",
      brand: "Vans Authentic",
      name: "Vans Authentic (Off-White/Cream)",
      price: 1830000,
      imageUrl: "/4.jpg",
      slug: "vans-authentic-off-white-cream",
    },
    {
      id: "5",
      brand: "Vans Authentic",
      name: "Vans Authentic (Leopard Print)",
      price: 1160000,
      originalPrice: 1729000, // Menampilkan harga coret
      imageUrl: "/5.webp",
      slug: "vans-authentic-leopard-print",
    },
    {
      id: "6",
      brand: "Vans Authentic",
      name: "Vans Authentic (Red/White)",
      price: 1160000,
      originalPrice: 1729000, // Menampilkan harga coret
      imageUrl: "/6.webp",
      slug: "vans-authentic-red-white",
    },
    {
      id: "7",
      brand: "Vans Authentic",
      name: "Vans Authentic (Checkerboard Grey)",
      price: 1160000,
      originalPrice: 1729000, // Menampilkan harga coret
      imageUrl: "/7.webp",
      slug: "vans-authentic-checkerboard-grey",
    },
    {
      id: "8",
      brand: "Vans Authentic",
      name: "Vans Authentic x Chibi Maruko-chan",
      price: 1160000,
      originalPrice: 1729000, // Menampilkan harga coret
      imageUrl: "/8.jpg",
      slug: "vans-authentic-chibi-maruko-chan",
    },
    {
      id: "9",
      brand: "Vans Authentic",
      name: "Vans Authentic (Brown/Tan)",
      price: 1160000,
      originalPrice: 1729000, // Menampilkan harga coret
      imageUrl: "/9.jpg",
      slug: "vans-authentic-brown-tan",
    },
    {
      id: "10",
      brand: "Vans Era",
      name: "Vans Era Checkerboard (Black/White)",
      price: 1160000,
      originalPrice: 1729000, // Menampilkan harga coret
      imageUrl: "/11.jpg",
      slug: "vans-era-checkerboard-black-white",
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
