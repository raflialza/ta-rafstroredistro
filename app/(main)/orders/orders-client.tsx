"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Order = {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  snap_token: string | null;
  payment_type: string | null;
};

export function OrdersClient({ orders }: { orders: Order[] }) {
  const router = useRouter();

  useEffect(() => {
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";
    
    // Check if script already exists to avoid duplicates
    if (document.querySelector(`script[src="${snapScript}"]`)) return;

    const script = document.createElement("script");
    script.src = snapScript;
    script.setAttribute("data-client-key", clientKey);
    script.async = true;

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const formatIDR = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleResumePayment = (snapToken: string, orderId: string) => {
    // @ts-expect-error - window.snap is injected by Midtrans script
    if (window.snap) {
      // @ts-expect-error - window.snap
      window.snap.pay(snapToken, {
        onSuccess: function (result: any) {
          console.log("payment success", result);
          router.push(`/checkout/success?order_id=${orderId}`);
        },
        onPending: function (result: any) {
          console.log("payment pending", result);
          router.refresh();
        },
        onError: function (result: any) {
          console.log("payment error", result);
          alert("Pembayaran gagal!");
        },
        onClose: function () {
          console.log("customer closed the popup without finishing the payment");
        },
      });
    } else {
      alert("Sistem pembayaran sedang dimuat, silakan coba lagi dalam beberapa detik.");
    }
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-zinc-50 border border-dashed rounded-xl">
        <h3 className="text-xl font-bold mb-2">Belum ada pesanan</h3>
        <p className="text-muted-foreground mb-6">Anda belum pernah melakukan pemesanan.</p>
        <Button onClick={() => router.push("/")} className="bg-red-600 hover:bg-red-700">
          Mulai Belanja
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order.id} className="border rounded-xl p-6 bg-white shadow-sm flex flex-col md:flex-row justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-lg">Order ID: <span className="font-mono text-sm">{order.id.split("-")[0]}</span></h3>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                order.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                order.status === "settlement" || order.status === "success" ? "bg-green-100 text-green-800" :
                "bg-red-100 text-red-800"
              }`}>
                {order.status}
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Dibuat {new Date(order.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="text-sm">
              Metode: <span className="font-semibold uppercase">{order.payment_type || "Midtrans"}</span>
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-4 justify-center">
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Total Tagihan</p>
              <p className="font-black text-xl text-red-600">{formatIDR(order.total_amount)}</p>
            </div>
            
            {order.status === "pending" && order.snap_token && (
              <Button 
                onClick={() => handleResumePayment(order.snap_token!, order.id)}
                className="bg-black hover:bg-black/80 text-white font-bold w-full md:w-auto"
              >
                Bayar Sekarang
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
