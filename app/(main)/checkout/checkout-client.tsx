"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CreditCard, Wallet, Truck } from "lucide-react";

// Menerima data harga dari Server Component
export function CheckoutClient({
  subtotal,
  totalItems,
}: {
  subtotal: number;
  totalItems: number;
}) {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<string>("bank_transfer");
  const [isLoading, setIsLoading] = useState(false);

  // Ongkos kirim tetap (contoh)
  const ongkosKirim = 50000;
  const totalTagihan = subtotal + ongkosKirim;

  const formatIDR = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleProcessPayment = async () => {
    setIsLoading(true);
    // Simulasi loading
    await new Promise((resolve) => setTimeout(resolve, 1500));

    alert(
      `Pesanan berhasil! Total: ${formatIDR(totalTagihan)} dengan ${paymentMethod}`,
    );
    setIsLoading(false);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-10">
      {/* KIRI: Pilihan Metode Pembayaran */}
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-xl font-semibold">Select Payment Method</h2>
        <div className="space-y-3">
          {/* Transfer Bank */}
          <label
            className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === "bank_transfer" ? "border-black bg-zinc-50 ring-1 ring-black" : "hover:bg-zinc-50"}`}
          >
            <div className="flex items-center gap-4">
              <input
                type="radio"
                name="payment"
                value="bank_transfer"
                checked={paymentMethod === "bank_transfer"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4 text-black focus:ring-black"
              />
              <div>
                <p className="font-bold text-sm">Transfer Bank</p>
                <p className="text-xs text-muted-foreground">
                  BCA, Mandiri, BNI, BRI
                </p>
              </div>
            </div>
            <CreditCard className="text-muted-foreground w-6 h-6" />
          </label>

          {/* E-Wallet */}
          <label
            className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === "ewallet" ? "border-black bg-zinc-50 ring-1 ring-black" : "hover:bg-zinc-50"}`}
          >
            <div className="flex items-center gap-4">
              <input
                type="radio"
                name="payment"
                value="ewallet"
                checked={paymentMethod === "ewallet"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4 text-black focus:ring-black"
              />
              <div>
                <p className="font-bold text-sm">E-Wallet / QRIS</p>
                <p className="text-xs text-muted-foreground">
                  GoPay, OVO, Dana, ShopeePay
                </p>
              </div>
            </div>
            <Wallet className="text-muted-foreground w-6 h-6" />
          </label>

          {/* COD */}
          <label
            className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === "cod" ? "border-black bg-zinc-50 ring-1 ring-black" : "hover:bg-zinc-50"}`}
          >
            <div className="flex items-center gap-4">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4 text-black focus:ring-black"
              />
              <div>
                <p className="font-bold text-sm">Bayar di Tempat (COD)</p>
                <p className="text-xs text-muted-foreground">
                  Bayar saat kurir tiba
                </p>
              </div>
            </div>
            <Truck className="text-muted-foreground w-6 h-6" />
          </label>
        </div>
      </div>

      {/* KANAN: Ringkasan Pesanan Dinamis */}
      <div className="lg:col-span-1">
        <div className="border rounded-xl p-6 bg-zinc-50 space-y-6 sticky top-24">
          <h2 className="text-lg font-bold border-b pb-4">Ringkasan Belanja</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Subtotal ({totalItems} barang)
              </span>
              <span className="font-medium">{formatIDR(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ongkos Kirim</span>
              <span className="font-medium">{formatIDR(ongkosKirim)}</span>
            </div>
          </div>

          <div className="flex justify-between border-t pt-4">
            <span className="font-bold text-lg">Total Tagihan</span>
            <span className="font-black text-xl text-red-600">
              {formatIDR(totalTagihan)}
            </span>
          </div>

          <Button
            className="w-full h-12 text-base font-bold bg-black text-white hover:bg-black/80"
            onClick={handleProcessPayment}
            disabled={isLoading}
          >
            {isLoading ? "Memproses..." : "Bayar Sekarang"}
          </Button>
        </div>
      </div>
    </div>
  );
}
