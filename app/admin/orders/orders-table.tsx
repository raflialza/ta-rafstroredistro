"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Order = {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  payment_type: string | null;
};

export function OrdersTable({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const formatIDR = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    setIsLoading(orderId);

    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (!error) {
      setOrders(
        orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );
      router.refresh();
    } else {
      alert("Gagal mengupdate status pesanan.");
    }

    setIsLoading(null);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-zinc-100 text-muted-foreground uppercase text-xs font-bold border-b-2">
          <tr>
            <th className="px-6 py-5">Order ID</th>
            <th className="px-6 py-5">Waktu</th>
            <th className="px-6 py-5">Total Pendapatan</th>
            <th className="px-6 py-5">Status</th>
            <th className="px-6 py-5 text-right">Tindakan Admin</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {orders.map((order) => (
            <tr
              key={order.id}
              className="hover:bg-zinc-50/50 transition-colors"
            >
              <td className="px-6 py-4 font-mono font-semibold text-xs">
                {order.id.split("-")[0]}
              </td>
              <td className="px-6 py-4 text-muted-foreground">
                {new Date(order.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
              <td className="px-6 py-4 font-black text-red-600">
                {formatIDR(order.total_amount)}
              </td>
              <td className="px-6 py-4">
                {/* 👇 MENYESUAIKAN STATUS DARI WEBHOOK 👇 */}
                <span
                  className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    order.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.status === "paid"
                        ? "bg-green-100 text-green-800"
                        : order.status === "shipped"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "completed"
                            ? "bg-zinc-800 text-white"
                            : "bg-red-100 text-red-800" // Untuk cancelled
                  }`}
                >
                  {order.status === "paid"
                    ? "DIBAYAR"
                    : order.status === "shipped"
                      ? "DIKIRIM"
                      : order.status === "completed"
                        ? "SELESAI"
                        : order.status === "cancelled"
                          ? "BATAL"
                          : order.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                {/* 1. Jika statusnya "paid", admin bisa Kirim Barang */}
                {order.status === "paid" && (
                  <Button
                    size="sm"
                    onClick={() => updateStatus(order.id, "shipped")}
                    disabled={isLoading === order.id}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
                  >
                    {isLoading === order.id ? "Memproses..." : "Kirim Barang"}
                  </Button>
                )}

                {/* 2. Jika statusnya "shipped", admin bisa selesaikan pesanan */}
                {order.status === "shipped" && (
                  <Button
                    size="sm"
                    onClick={() => updateStatus(order.id, "completed")}
                    disabled={isLoading === order.id}
                    variant="outline"
                    className="border-zinc-800 text-zinc-800 hover:bg-zinc-800 hover:text-white font-bold"
                  >
                    {isLoading === order.id ? "Memproses..." : "Selesaikan"}
                  </Button>
                )}

                {order.status === "pending" && (
                  <span className="text-muted-foreground text-xs font-medium">
                    Menunggu Pelanggan
                  </span>
                )}
                {order.status === "completed" && (
                  <span className="text-zinc-800 font-black text-xs uppercase tracking-wider">
                    Tuntas ✓
                  </span>
                )}
                {order.status === "cancelled" && (
                  <span className="text-red-600 font-bold text-xs uppercase">
                    Dibatalkan
                  </span>
                )}
              </td>
            </tr>
          ))}

          {orders.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="px-6 py-16 text-center text-muted-foreground"
              >
                <span className="text-3xl block mb-2">📦</span>
                Belum ada pesanan yang masuk ke tokomu.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
