"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

// Daftar ukuran sepatu standar (Kamu bisa mengubahnya nanti jika ada di database)
const SIZES = ["39", "40", "41", "42", "43", "44"];

export function ProductActions({ productId, sizes }: { productId: string; sizes?: any[] }) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert("⚠️ Silakan pilih ukuran sepatu terlebih dahulu!");
      return;
    }

    setIsLoading(true);

    // Cek apakah user sudah login
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Kamu harus login untuk menambahkan barang ke keranjang.");
      router.push("/auth/login");
      return;
    }

    // Cek apakah sepatu dengan ukuran yang sama sudah ada di keranjang
    const { data: existingItem } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .eq("size", selectedSize)
      .single();

    if (existingItem) {
      // Jika ada, tambahkan quantity-nya saja
      await supabase
        .from("cart_items")
        .update({ quantity: existingItem.quantity + 1 })
        .eq("id", existingItem.id);
    } else {
      // Jika belum ada, masukkan sebagai barang baru
      await supabase.from("cart_items").insert({
        user_id: user.id,
        product_id: productId,
        size: selectedSize,
        quantity: 1,
      });
    }

    alert(
      `✅ Sepatu ukuran ${selectedSize} berhasil ditambahkan ke keranjang!`,
    );
    setIsLoading(false);

    // Refresh agar angka keranjang di Navbar langsung terupdate
    router.refresh();
  };

  return (
    <div className="space-y-8 mt-8">
      {/* --- Pemilihan Ukuran --- */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-sm uppercase tracking-wider">
            Pilih Ukuran
          </h3>
          <span className="text-xs text-muted-foreground underline cursor-pointer">
            Panduan Ukuran
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          {(sizes && sizes.length > 0 ? sizes.map((s) => String(s.size)) : SIZES).map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`w-14 h-12 flex items-center justify-center border-2 rounded-xl font-bold transition-all ${
                selectedSize === size
                  ? "border-black bg-black text-white scale-110 shadow-md" // Efek saat dipilih
                  : "border-muted hover:border-black text-foreground bg-white"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* --- Tombol Add To Cart --- */}
      <Button
        size="lg"
        className="w-full h-14 text-lg font-bold rounded-xl transition-transform active:scale-95"
        onClick={handleAddToCart}
        disabled={isLoading}
      >
        {isLoading ? (
          "Memproses..."
        ) : (
          <>
            <ShoppingCart className="mr-3 h-5 w-5" />
            Tambah ke Keranjang
          </>
        )}
      </Button>
    </div>
  );
}
