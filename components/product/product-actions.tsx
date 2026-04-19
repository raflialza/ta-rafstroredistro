"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // 1. Import useRouter
import { createClient } from "@/lib/supabase/client"; // 2. Import Supabase Client

interface ProductActionsProps {
  productId: string;
  availableSizes: number[];
}

export function ProductActions({
  productId,
  availableSizes,
}: ProductActionsProps) {
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Tambahan state loading agar tombol tidak diklik 2x
  const router = useRouter();

  // 3. Ubah fungsi ini menjadi async
  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert("Pilih ukuran terlebih dahulu!");
      return;
    }

    setIsLoading(true); // Nyalakan efek loading

    try {
      const supabase = createClient();

      // Cek apakah pengguna sudah login
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Kamu harus login terlebih dahulu untuk berbelanja.");
        router.push("/auth/login"); // Arahkan ke halaman login
        return;
      }

      // Masukkan data ke tabel cart_items
      const { error } = await supabase.from("cart_items").insert({
        user_id: user.id,
        product_id: productId, // Menggunakan ID produk yang sedang dilihat
        size: selectedSize, // Menggunakan ukuran yang dipilih
        quantity: 1, // Jumlah bawaan adalah 1
      });

      if (error) {
        console.error("Gagal memasukkan ke keranjang:", error.message);
        alert("Ups, terjadi kesalahan saat menambahkan ke keranjang.");
      } else {
        // Jika sukses, arahkan ke halaman keranjang dan refresh data
        router.push("/cart");
        router.refresh();
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsLoading(false); // Matikan efek loading
    }
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
              disabled={isLoading}
              className={`py-3 text-sm font-medium rounded-md border transition-all 
                ${
                  selectedSize === size
                    ? "border-black bg-black text-white"
                    : "border-muted-foreground/30 hover:border-black bg-transparent"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <Button
        size="lg"
        className="w-full text-base font-semibold h-14 transition-all"
        onClick={handleAddToCart}
        disabled={isLoading} // Tombol mati saat proses loading ke database
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
