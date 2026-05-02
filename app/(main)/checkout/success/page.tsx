"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const status = searchParams.get("status");

  const isPending = status === "pending";

  return (
    <div className="container mx-auto py-24 px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
      <div className="flex justify-center mb-6">
        {isPending ? (
          <Clock className="w-24 h-24 text-yellow-500" />
        ) : (
          <CheckCircle2 className="w-24 h-24 text-emerald-500" />
        )}
      </div>

      <h1 className="text-4xl font-black italic uppercase mb-4">
        {isPending ? "Menunggu Pembayaran" : "Pesanan Berhasil!"}
      </h1>

      <p className="text-lg text-muted-foreground mb-8">
        {isPending
          ? "Silakan selesaikan pembayaran sesuai instruksi yang diberikan."
          : "Terima kasih atas pesanan Anda. Kami akan segera memprosesnya."}
      </p>

      {orderId && (
        <div className="bg-zinc-50 border rounded-xl p-6 mb-8 mx-auto max-w-md">
          <p className="text-sm text-muted-foreground mb-1">ID Pesanan:</p>
          <p className="font-mono font-bold text-lg">{orderId}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link href="/">
          <Button variant="outline" className="w-full sm:w-auto h-12 px-8">
            Kembali ke Beranda
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-24 text-center">Memuat...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
