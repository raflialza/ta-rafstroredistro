import { CategoryCard } from "./category-card";

// TODO: Replace this with actual Supabase fetch logic
async function getCategories() {
  // Simulating network delay to show off the skeleton!
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return [
    {
      id: 1,
      name: "Old Skool",
      slug: "t-shirts",
      description: "Graphic tees and basics.",
      imageurl: "/10.jpg",
    },
    {
      id: 2,
      name: "Authentic",
      slug: "hoodies",
      description: "Stay warm with our thick hoodies.",
      imageurl: "/1.jpg",
    },
    {
      id: 3,
      name: "Era",
      slug: "outerwear",
      description: "Jackets, flannels, and windbreakers.",
      imageurl: "/11.jpg",
    },
    {
      id: 4,
      name: "Classic Slip-On",
      slug: "accessories",
      description: "Caps, beanies, and bags.",
      imageurl: "/12.jpg",
    },
  ];
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
