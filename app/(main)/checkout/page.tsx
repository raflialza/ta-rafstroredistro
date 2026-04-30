import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CheckoutClient } from "./checkout-client";

export default async function CheckoutPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // 1. Ambil data keranjang aslimu
  const { data: cartItems } = await supabase
    .from("cart_items")
    .select(
      `
      id,
      quantity,
      products ( price )
    `,
    )
    .eq("user_id", user.id);

  // Jika keranjang kosong, kembalikan ke halaman keranjang
  if (!cartItems || cartItems.length === 0) {
    redirect("/cart");
  }

  // 2. Hitung total harga asli
  const subtotal = cartItems.reduce((total, item) => {
    // @ts-ignore
    const productPrice = item.products?.price || 0;
    return total + productPrice * item.quantity;
  }, 0);

  // Hitung jumlah barang
  const totalItems = cartItems.reduce(
    (count, item) => count + item.quantity,
    0,
  );

  return (
    <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-5xl">
      <h1 className="text-3xl font-black italic mb-8 uppercase">Checkout</h1>

      {/* 3. Panggil komponen Client dan oper nilai harga aslinya! */}
      <CheckoutClient subtotal={subtotal} totalItems={totalItems} />
    </main>
  );
}
