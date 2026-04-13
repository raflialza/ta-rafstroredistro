"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ProductActionsProps {
  productId: string;
  availableSizes: number[];
}

export function ProductActions({
  productId,
  availableSizes,
}: ProductActionsProps) {
  const [selectedSize, setSelectedSize] = useState<number | null>(null);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Pilih ukuran terlebih dahulu!");
      return;
    }
    alert(`Produk dengan ukuran ${selectedSize} berhasil ditambahkan!`);
  };

  return (
    <div className="flex flex-col gap-6 mt-6">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold">Pilih Ukuran (EU)</span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {availableSizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`py-3 text-sm font-medium rounded-md border transition-all 
                ${
                  selectedSize === size
                    ? "border-black bg-black text-white"
                    : "border-muted-foreground/30 hover:border-black bg-transparent"
                }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <Button
        size="lg"
        className="w-full text-base font-semibold h-14"
        onClick={handleAddToCart}
      >
        {selectedSize
          ? `Tambah Ukuran ${selectedSize} ke Keranjang`
          : "Pilih Ukuran"}
      </Button>
    </div>
  );
}
