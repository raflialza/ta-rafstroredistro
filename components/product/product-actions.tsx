"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // 1. Import useRouter
import { createClient } from "@/lib/supabase/client"; // 2. Import Supabase Client

interface ProductSizeStock {
  size: number;
  stock: number;
}

interface ProductActionsProps {
  productId: string;
  sizes: ProductSizeStock[];
}

export function ProductActions({
  productId,
  sizes,
}: ProductActionsProps) {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Menghitung total stok dari semua ukuran
  const totalStock = sizes.reduce((acc, curr) => acc + curr.stock, 0);

  if (totalStock === 0 || sizes.length === 0) {
    return (
      <div className="flex flex-col gap-4 mt-6">
        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-800 dark:text-red-300 rounded-xl">
          <svg
            className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="font-semibold text-sm sm:text-base">Stok Habis</p>
            <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 mt-1">Produk ini sedang tidak tersedia untuk saat ini. Silakan hubungi kami untuk informasi restock.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert("Pilih ukuran terlebih dahulu!");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Kamu harus login terlebih dahulu untuk berbelanja.");
        router.push("/auth/login");
        return;
      }

      const { error } = await supabase.from("cart_items").insert({
        user_id: user.id,
        product_id: productId,
        size: selectedSize,
        quantity: 1,
      });

      if (error) {
        console.error("Gagal memasukkan ke keranjang:", error.message);
        alert("Ups, terjadi kesalahan saat menambahkan ke keranjang.");
      } else {
        router.push("/cart");
        router.refresh();
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 mt-6">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold">Pilih Ukuran (EU)</span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {sizes.map(({ size, stock }) => {
            const isOutOfStock = stock === 0;
            return (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                disabled={isLoading || isOutOfStock}
                className={`py-3 text-sm font-medium rounded-md border transition-all 
                  ${
                    selectedSize === size
                      ? "border-black bg-black text-white"
                      : isOutOfStock
                        ? "border-muted-foreground/20 bg-muted/30 text-muted-foreground line-through opacity-50"
                        : "border-muted-foreground/30 hover:border-black bg-transparent"
                  } ${isLoading || isOutOfStock ? "cursor-not-allowed" : ""}`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      <Button
        size="lg"
        className="w-full text-base font-semibold h-14 transition-all"
        onClick={handleAddToCart}
        disabled={isLoading || !selectedSize} 
      >
        {isLoading
          ? "Menambahkan..."
          : selectedSize
            ? `Tambah Ukuran ${selectedSize} ke Keranjang`
            : "Pilih Ukuran"}
      </Button>
    </div>
  );
}
