import { DeleteCartButton } from "@/components/delete-cart-button";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default async function CartPage() {
  // 1. Inisialisasi Supabase dan cek user
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Jika belum login, tendang ke halaman login
  if (!user) {
    redirect("/auth/login");
  }

  // 2. Ambil data keranjang beserta info produknya dari database
  const { data: cartItems } = await supabase
    .from("cart_items")
    .select(
      `
      id,
      size,
      quantity,
      products (
        id,
        name,
        price,
        image_url,
        slug
      )
    `,
    )
    .eq("user_id", user.id);

  // 3. Fungsi untuk menghitung total harga
  const calculateTotal = () => {
    return (
      cartItems?.reduce((total, item) => {
        // @ts-ignore - Supabase join typing bisa sedikit tricky
        const productPrice = item.products?.price || 0;
        return total + productPrice * item.quantity;
      }, 0) || 0
    );
  };

  const formatIDR = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black italic mb-8 uppercase">
        Keranjang Belanja
      </h1>

      {/* Jika keranjang ada isinya */}
      {cartItems && cartItems.length > 0 ? (
        <div className="grid lg:grid-cols-3 gap-10 items-start">
          {/* Daftar Produk di Kiri */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {cartItems.map((item: any) => (
              <div
                key={item.id}
                className="flex gap-4 sm:gap-6 border rounded-xl p-4 shadow-sm bg-card"
              >
                {/* Gambar Produk */}
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-muted/50 rounded-lg relative overflow-hidden flex-shrink-0">
                  <Image
                    src={item.products.image_url}
                    alt={item.products.name}
                    fill
                    className="object-contain p-2 mix-blend-multiply"
                  />
                </div>

                {/* Detail Produk */}
                <div className="flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-bold text-lg line-clamp-2">
                      {item.products.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Ukuran:{" "}
                      <span className="font-semibold text-foreground">
                        {item.size}
                      </span>
                    </p>
                    <p className="font-black mt-2 text-[#10b981]">
                      {formatIDR(item.products.price)}
                    </p>
                  </div>

                  {/* Qty & Tombol Hapus */}
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm font-medium bg-muted px-3 py-1 rounded-md">
                      Qty: {item.quantity}
                    </span>
                    <DeleteCartButton cartItemId={item.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Ringkasan Harga di Kanan */}
          <div className="bg-muted/30 p-6 rounded-xl border sticky top-24">
            <h2 className="text-xl font-bold mb-6 border-b pb-4">
              Ringkasan Pesanan
            </h2>

            <div className="flex justify-between items-center mb-4 text-muted-foreground">
              <span>Subtotal ({cartItems.length} barang)</span>
              <span className="font-medium text-foreground">
                {formatIDR(calculateTotal())}
              </span>
            </div>

            <div className="flex justify-between items-center mb-6 text-muted-foreground">
              <span>Biaya Kirim</span>
              <span className="font-medium text-foreground">
                Dihitung saat checkout
              </span>
            </div>

            <div className="flex justify-between items-center mb-6 pt-4 border-t border-dashed">
              <span className="font-bold text-lg">Total</span>
              <span className="font-black text-xl text-red-600">
                {formatIDR(calculateTotal())}
              </span>
            </div>

            <Button className="w-full h-12 bg-black hover:bg-black/80 text-white font-bold text-lg rounded-xl transition-all">
              CHECKOUT SEKARANG
            </Button>
          </div>
        </div>
      ) : (
        //* Jika Keranjang Kosong *//
        <div className="text-center py-24 border-2 border-dashed rounded-2xl bg-muted/10">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🛒</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Keranjangmu masih kosong</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Sepertinya kamu belum menambahkan sepatu impianmu ke keranjang. Yuk,
            jelajahi koleksi kami sekarang!
          </p>
          <Link href="/products">
            <Button className="h-12 px-8 font-bold text-base rounded-full bg-red-600 hover:bg-red-700">
              Mulai Belanja
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
