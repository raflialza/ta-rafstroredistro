import { CategoryCard } from "./category-card";

// TODO: Replace this with actual Supabase fetch logic
async function getCategories() {
  // Simulating network delay to show off the skeleton!
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return [
    {
      id: 1,
      name: "Vans Old Skool",
      slug: "old-skool",
      description:
        "The original Vans model featuring a minimalist, low-top design with a simple lace-up canvas upper. It has remained a classic canvas sneaker staple since 1966.",
      imageurl: "/10.jpg",
    },
    {
      id: 2,
      name: "Vans Authentic",
      slug: "authentic",
      description:
        "An evolution of the Authentic, specifically designed by skaters to include a padded collar for extra ankle comfort and support during skate sessions.",
      imageurl: "/1.jpg",
    },
    {
      id: 3,
      name: "Vans Era",
      slug: "era",
      description:
        'The first model to debut the iconic "Sidestripe." It utilizes a combination of canvas and suede panels to increase durability and protection for the wearer.',
      imageurl: "/11.jpg",
    },
    {
      id: 4,
      name: "Vans Classic Slip-On",
      slug: "classic-slip-on",
      description:
        "The ultimate practical design, featuring a laceless upper with elastic side accents. It became a pop-culture icon, especially known for its ease of use and the famous checkerboard pattern.",
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
