"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Loader2 } from "lucide-react";

export function UpdateCartQuantity({
  cartItemId,
  initialQuantity,
}: {
  cartItemId: string | number;
  initialQuantity: number;
}) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const updateQuantity = async (newQuantity: number) => {
    // Mencegah jumlah berkurang di bawah 1
    if (newQuantity < 1) return;

    setIsLoading(true);
    setQuantity(newQuantity); // Update angka di layar secepat mungkin (Optimistic UI)

    // Update data di Supabase
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: newQuantity })
      .eq("id", cartItemId);

    if (!error) {
      router.refresh(); // Refresh halaman agar total harga terupdate
    } else {
      console.error("Gagal mengupdate jumlah:", error);
      setQuantity(initialQuantity); // Kembalikan ke angka semula jika error
    }

    setIsLoading(false);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={() => updateQuantity(quantity - 1)}
        disabled={isLoading || quantity <= 1}
      >
        <Minus className="h-3 w-3" />
      </Button>

      <span className="w-6 text-center text-sm font-medium">
        {isLoading ? (
          <Loader2 className="h-3 w-3 animate-spin mx-auto text-muted-foreground" />
        ) : (
          quantity
        )}
      </span>

      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={() => updateQuantity(quantity + 1)}
        disabled={isLoading}
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
}
