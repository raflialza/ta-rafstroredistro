"use client";

import { useRef } from "react";
import { ProductCard, type Product } from "./product-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ProductCarousel({ products }: { products: Product[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400; // Jarak geser
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative group w-full">
      {/* Tombol Panah Kiri */}
      <Button
        variant="secondary"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 md:-ml-6 z-10 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex bg-white/90 border-none hover:bg-white"
        onClick={() => scroll("left")}
      >
        <ChevronLeft className="h-6 w-6 text-black" />
      </Button>

      {/* Barisan Produk */}
      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-6 pt-2 px-1"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="min-w-[200px] xs:min-w-[230px] md:min-w-[280px] snap-start flex-shrink-0"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Tombol Panah Kanan */}
      <Button
        variant="secondary"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 md:-mr-6 z-10 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex bg-white/90 border-none hover:bg-white"
        onClick={() => scroll("right")}
      >
        <ChevronRight className="h-6 w-6 text-black" />
      </Button>
    </div>
  );
}
