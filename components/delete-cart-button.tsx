"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function DeleteCartButton({ cartItemId }: { cartItemId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    const supabase = createClient();

    // Hapus data dari database berdasarkan ID keranjang
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", cartItemId);

    if (!error) {
      router.refresh(); // Refresh halaman agar data keranjang terbaru dimuat ulang
    } else {
      alert("Gagal menghapus produk");
    }

    setIsDeleting(false);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-500 hover:text-red-600 hover:bg-red-50"
    >
      {/* Tampilkan ikon loading berputar jika sedang menghapus */}
      {isDeleting ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Trash2 className="h-5 w-5" />
      )}
    </Button>
  );
}
