import { CategoryCard } from "./category-card";
import { createClient } from "@/lib/supabase/server";

async function getCategories() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("*");

  // Fallback to minimal mock if table is empty or missing during setup
  if (!categories || categories.length === 0) {
    return [
      {
        id: "mock1",
        name: "Vans Old Skool",
        slug: "old-skool",
        description: "The original Vans model featuring a minimalist, low-top design.",
        image_url: "/10.jpg",
      },
      {
        id: "mock2",
        name: "Vans Authentic",
        slug: "authentic",
        description: "An evolution of the Authentic, specifically designed by skaters.",
        image_url: "/1.jpg",
      },
      {
        id: "mock3",
        name: "Vans Era",
        slug: "era",
        description: "The first model to debut the iconic Sidestripe.",
        image_url: "/11.jpg",
      },
      {
        id: "mock4",
        name: "Vans Classic Slip-On",
        slug: "classic-slip-on",
        description: "The ultimate practical design, featuring a laceless upper with elastic side accents.",
        image_url: "/12.jpg",
      },
    ];
  }

  // Handle difference in casing between mock `imageurl` and database `image_url`
  return categories.map((c) => ({
    ...c,
    imageurl: c.image_url || c.imageurl, // fallback in case their type expects imageurl
  }));
}

export async function CategoryList() {
  const categories = await getCategories();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}
