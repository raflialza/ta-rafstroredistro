"use client";

import { useRef } from "react";
import { ProductCard } from "./product-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ProductCarousel({ products }: { products: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400; // Jarak geser per klik
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative group w-full">
      {/* Tombol Kiri */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-20 rounded-full bg-white shadow-xl opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex border-none hover:bg-red-50 text-red-600"
        onClick={() => scroll("left")}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      {/* Kontainer Produk */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-6 pt-2 px-1"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="min-w-[280px] snap-start flex-shrink-0"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Tombol Kanan */}
      <Button
        variant="outline"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-20 rounded-full bg-white shadow-xl opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex border-none hover:bg-red-50 text-red-600"
        onClick={() => scroll("right")}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  );
}
