import { createClient } from "@/lib/supabase/server";
import { HeroCarousel } from "./hero-carousel";

export async function HeroSection() {
  const supabase = await createClient();

  // Ambil data hero banners dari Supabase
  const { data: banners, error } = await supabase
    .from("hero_banners")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching hero banners:", error.message);
    return null;
  }

  // Jika tidak ada data atau db kosong, fallback ke dummy banners
  // Ini membantu website tetap keren bahkan sebelum database diisi
  const fallbackBanners = [
    {
      id: "fallback-1",
      title: "New Arrivals",
      subtitle: "Explore the latest collection of sneakers",
      image_url: "/modelhero.jpg",
      link_url: "#products",
    },
    {
      id: "fallback-2",
      title: "Summer Sale",
      subtitle: "Up to 50% discount on selected items",
      image_url: "/modelhero2.jpg",
      link_url: "#products",
    },
  ];

  const finalBanners =
    banners && banners.length > 0 ? banners : fallbackBanners;

  return (
    <section className="w-full pt-4 pb-8">
      <HeroCarousel banners={finalBanners} />
    </section>
  );
}
