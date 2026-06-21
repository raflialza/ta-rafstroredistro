"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Order = {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  payment_type: string | null;
  tracking_number: string | null;
  refund_reason?: string | null;
  refund_proof_url?: string | null;
};

export function OrdersTable({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>(
    {},
  );
  const supabase = createClient();
  const router = useRouter();

  const formatIDR = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const updateStatus = async (
    orderId: string,
    newStatus: string,
    trackingNumber?: string,
  ) => {
    setIsLoading(orderId);

    // Siapkan data yang mau di-update
    const updateData: any = { status: newStatus };
    if (trackingNumber) {
      updateData.tracking_number = trackingNumber;
    }

    const { error } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", orderId);

    if (!error) {
      setOrders(
        orders.map((o) => (o.id === orderId ? { ...o, ...updateData } : o)),
      );
      router.refresh();
    } else {
      alert("Gagal memperbarui pesanan.");
    }
    setIsLoading(null);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-zinc-100 text-muted-foreground uppercase text-xs font-bold border-b-2">
          <tr>
            <th className="px-6 py-5">Order ID</th>
            <th className="px-6 py-5">Total</th>
            <th className="px-6 py-5">Status</th>
            <th className="px-6 py-5">Nomor Resi</th>
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
                <div className="text-muted-foreground font-sans mt-1">
                  {new Date(order.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </td>
              <td className="px-6 py-4 font-black text-red-600">
                {formatIDR(order.total_amount)}
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col gap-2 items-start">
                  <span
                    className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      order.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "paid"
                          ? "bg-green-100 text-green-800"
                          : order.status === "processing"
                            ? "bg-purple-100 text-purple-800"
                            : order.status === "shipped"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : order.status === "refund_requested"
                                  ? "bg-orange-100 text-orange-800"
                                  : order.status === "refund_approved"
                                    ? "bg-zinc-800 text-white"
                                    : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.status === "paid"
                      ? "DIBAYAR"
                      : order.status === "processing"
                        ? "DIPROSES"
                        : order.status === "shipped"
                          ? "DIKIRIM"
                          : order.status === "completed"
                            ? "BERHASIL"
                            : order.status === "refund_requested"
                              ? "REFUND DIAJUKAN"
                              : order.status === "refund_approved"
                                ? "REFUND DISETUJUI"
                                : order.status === "refund_rejected"
                                  ? "REFUND DITOLAK"
                                  : order.status}
                  </span>

                  {(order.status === "refund_requested" || order.status === "refund_approved" || order.status === "refund_rejected") && order.refund_reason && (
                    <div className="text-xs bg-orange-50 border border-orange-100 p-2 rounded-lg mt-1 w-48">
                      <p className="font-bold text-orange-800">Alasan Refund:</p>
                      <p className="text-orange-700">{order.refund_reason}</p>
                      {order.refund_proof_url && (
                        <a 
                          href={order.refund_proof_url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-blue-600 underline mt-1 inline-block font-semibold"
                        >
                          Lihat Bukti Foto
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </td>

              {/* KOLOM NOMOR RESI */}
              <td className="px-6 py-4">
                {order.status === "processing" ? (
                  <Input
                    placeholder="Input Resi (JNE/JNT...)"
                    className="h-8 text-xs w-40"
                    value={trackingInputs[order.id] || ""}
                    onChange={(e) =>
                      setTrackingInputs({
                        ...trackingInputs,
                        [order.id]: e.target.value,
                      })
                    }
                  />
                ) : (
                  <span className="font-mono text-xs font-semibold">
                    {order.tracking_number || "-"}
                  </span>
                )}
              </td>

              <td className="px-6 py-4 text-right space-x-2">
                {/* TOMBOL 1: DIBAYAR -> DIPROSES */}
                {order.status === "paid" && (
                  <Button
                    size="sm"
                    onClick={() => updateStatus(order.id, "processing")}
                    disabled={isLoading === order.id}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold"
                  >
                    {isLoading === order.id ? "Memproses..." : "Proses Pesanan"}
                  </Button>
                )}

                {/* TOMBOL 2: DIPROSES -> DIKIRIM (Harus isi resi) */}
                {order.status === "processing" && (
                  <Button
                    size="sm"
                    onClick={() => {
                      if (!trackingInputs[order.id])
                        return alert("Harap isi nomor resi terlebih dahulu!");
                      updateStatus(
                        order.id,
                        "shipped",
                        trackingInputs[order.id],
                      );
                    }}
                    disabled={isLoading === order.id}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
                  >
                    {isLoading === order.id ? "Memproses..." : "Kirim Barang"}
                  </Button>
                )}

                {order.status === "shipped" && (
                  <span className="text-muted-foreground text-xs font-medium">
                    Menunggu Konfirmasi Pelanggan
                  </span>
                )}
                {order.status === "completed" && (
                  <span className="text-zinc-800 font-black text-xs uppercase tracking-wider">
                    Berhasil ✓
                  </span>
                )}

                {/* TOMBOL REFUND */}
                {order.status === "refund_requested" && (
                  <div className="flex flex-col gap-2 items-end">
                    <Button
                      size="sm"
                      onClick={() => updateStatus(order.id, "refund_approved")}
                      disabled={isLoading === order.id}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold w-full"
                    >
                      {isLoading === order.id ? "Memproses..." : "Setujui Refund"}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => updateStatus(order.id, "refund_rejected")}
                      disabled={isLoading === order.id}
                      variant="destructive"
                      className="font-bold w-full"
                    >
                      {isLoading === order.id ? "Memproses..." : "Tolak Refund"}
                    </Button>
                  </div>
                )}
                
                {order.status === "refund_approved" && (
                  <span className="text-zinc-800 font-black text-xs uppercase tracking-wider">
                    Refund Disetujui ✓
                  </span>
                )}
                
                {order.status === "refund_rejected" && (
                  <span className="text-red-600 font-black text-xs uppercase tracking-wider">
                    Refund Ditolak ✖
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
                Belum ada pesanan yang masuk.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
