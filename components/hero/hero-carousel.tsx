"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  link_url: string | null;
}

export function HeroCarousel({ banners }: { banners: Banner[] }) {
  if (!banners || banners.length === 0) return null;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 mt-4">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-7xl mx-auto relative group"
      >
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id}>
              <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden rounded-2xl mx-auto">
                <Image
                  src={banner.image_url}
                  alt={banner.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-black/30 transition-all duration-500 hover:bg-black/40 flex flex-col items-center justify-center text-center p-6 text-white space-y-4">
                  <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg">
                    {banner.title}
                  </h1>
                  {banner.subtitle && (
                    <p className="text-lg md:text-2xl text-white/90 max-w-[600px] drop-shadow-md">
                      {banner.subtitle}
                    </p>
                  )}
                  {banner.link_url && (
                    <Button 
                      asChild 
                      size="lg" 
                      className="mt-6 bg-white text-black hover:bg-white/90 rounded-full px-8 py-6 text-lg tracking-wider"
                    >
                      <Link href={banner.link_url}>
                        Shop Now
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Buttons hidden on mobile visually but visible on hover for md+ screens */}
        <CarouselPrevious className="absolute left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/50 hover:bg-white text-black border-none hidden md:flex h-12 w-12" />
        <CarouselNext className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/50 hover:bg-white text-black border-none hidden md:flex h-12 w-12" />
      </Carousel>
    </div>
  );
}
