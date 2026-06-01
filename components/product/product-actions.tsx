"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // 1. Import useRouter
import { createClient } from "@/lib/supabase/client"; // 2. Import Supabase Client

interface ProductActionsProps {
  productId: string;
  availableSizes: number[];
  isPurchased?: boolean;
  stock?: number;
}

export function ProductActions({
  productId,
  availableSizes,
  isPurchased = false,
  stock = 0,
}: ProductActionsProps) {
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Tambahan state loading agar tombol tidak diklik 2x
  const router = useRouter();

  if (isPurchased) {
    return (
      <div className="flex flex-col gap-4 mt-6">
        <div className="flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-300 rounded-xl">
          <svg
            className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="font-semibold text-sm sm:text-base">Anda sudah memiliki produk ini</p>
            <p className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 mt-1">Terima kasih telah melakukan pembelian! Akses produk ini dapat dilihat di riwayat pesanan Anda.</p>
          </div>
        </div>
      </div>
    );
  }

  if (stock === 0) {
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
