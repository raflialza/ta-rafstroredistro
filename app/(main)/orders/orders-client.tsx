"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function OrdersClient({
  initialOrders,
}: {
  initialOrders: any[];
}) {
  const [orders, setOrders] = useState(initialOrders);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  
  // Refund state
  const [refundOrderId, setRefundOrderId] = useState<string | null>(null);
  const [refundReason, setRefundReason] = useState<string>("Barang Rusak");
  const [refundFile, setRefundFile] = useState<File | null>(null);
  const [isRefunding, setIsRefunding] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  // Load Midtrans Snap Script
  useEffect(() => {
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";
    const script = document.createElement("script");
    script.src = snapScript;
    script.setAttribute("data-client-key", clientKey);
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const formatIDR = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Fungsi Pelanggan: Konfirmasi Terima Barang
  const confirmDelivery = async (orderId: string) => {
    if (!confirm("Apakah Anda yakin telah menerima pesanan ini dengan baik?"))
      return;

    setIsLoading(orderId);
    const { error } = await supabase
      .from("orders")
      .update({ status: "completed" })
      .eq("id", orderId);

    if (!error) {
      setOrders(
        orders.map((o) =>
          o.id === orderId ? { ...o, status: "completed" } : o,
        ),
      );
      router.refresh();
    }
    setIsLoading(null);
  };

  // Fungsi Pelanggan: Lanjutkan Pembayaran (Midtrans)
  const handlePayPending = (snapToken: string) => {
    if (!snapToken) {
      alert("Token pembayaran tidak ditemukan. Silakan hubungi admin.");
      return;
    }

    // @ts-expect-error - window.snap is injected by Midtrans script
    if (window.snap) {
      // @ts-expect-error
      window.snap.pay(snapToken, {
        onSuccess: function (result: any) {
          console.log("success", result);
          alert("Pembayaran berhasil!");
          // Tunggu sebentar agar webhook Midtrans sempat mengupdate database
          setTimeout(() => router.refresh(), 1500); 
        },
        onPending: function (result: any) {
          console.log("pending", result);
          alert("Menunggu pembayaran Anda.");
          setTimeout(() => router.refresh(), 1500);
        },
        onError: function (result: any) {
          console.log("error", result);
          alert("Pembayaran gagal!");
        },
        onClose: function () {
          console.log("customer closed the popup without finishing the payment");
        },
      });
    } else {
      alert("Sistem pembayaran belum siap. Silakan refresh halaman dan coba lagi.");
    }
  };

  // Fungsi Pelanggan: Ajukan Refund
  const submitRefund = async () => {
    if (!refundOrderId) return;
    if (!refundFile) {
      alert("Harap unggah foto bukti kerusakan/ketidaksesuaian barang.");
      return;
    }

    setIsRefunding(true);

    try {
      // 1. Upload foto ke bucket 'refunds'
      const fileExt = refundFile.name.split('.').pop();
      const fileName = `${refundOrderId}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('refunds')
        .upload(filePath, refundFile);

      if (uploadError) throw uploadError;

      // 2. Dapatkan public URL dari gambar yang diupload
      const { data: publicUrlData } = supabase.storage
        .from('refunds')
        .getPublicUrl(filePath);

      const proofUrl = publicUrlData.publicUrl;

      // 3. Update tabel orders
      const { error: updateError } = await supabase
        .from("orders")
        .update({ 
          status: "refund_requested",
          refund_reason: refundReason,
          refund_proof_url: proofUrl
        })
        .eq("id", refundOrderId);

      if (updateError) throw updateError;

      // Update UI state
      setOrders(
        orders.map((o) =>
          o.id === refundOrderId ? { ...o, status: "refund_requested", refund_reason: refundReason, refund_proof_url: proofUrl } : o,
        ),
      );
      
      alert("Pengajuan refund berhasil dikirim. Menunggu konfirmasi admin.");
      setRefundOrderId(null);
      setRefundFile(null);
      router.refresh();
    } catch (error: any) {
      console.error(error);
      alert("Terjadi kesalahan saat mengajukan refund: " + error.message);
    } finally {
      setIsRefunding(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* REFUND MODAL */}
      {refundOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h2 className="text-xl font-bold mb-4">Ajukan Refund</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Silakan lengkapi form di bawah ini untuk mengajukan pengembalian dana/barang untuk Order #{refundOrderId.split("-")[0]}.
            </p>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-1">Alasan Refund</label>
                <select 
                  className="w-full border rounded-lg p-2 text-sm bg-white"
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                >
                  <option value="Barang Rusak">Barang Rusak</option>
                  <option value="Barang Tidak Sesuai">Barang Tidak Sesuai Pesanan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Upload Foto Bukti</label>
                <input 
                  type="file" 
                  accept="image/*"
                  className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setRefundFile(e.target.files[0]);
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setRefundOrderId(null);
                  setRefundFile(null);
                }}
                disabled={isRefunding}
              >
                Batal
              </Button>
              <Button 
                className="bg-black text-white hover:bg-zinc-800"
                onClick={submitRefund}
                disabled={isRefunding}
              >
                {isRefunding ? "Mengirim..." : "Kirim Pengajuan"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {orders.map((order) => (
        <div
          key={order.id}
          className="border p-6 rounded-2xl bg-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-bold text-lg font-mono">
                Order #{order.id.split("-")[0]}
              </h3>

              {/* LABEL STATUS */}
              <span
                className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
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
            </div>

            <p className="text-sm text-muted-foreground mb-1">
              Tanggal:{" "}
              {new Date(order.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="text-xl font-black text-red-600 mb-2">
              {formatIDR(order.total_amount)}
            </p>

            {/* TAMPILKAN RESI JIKA SUDAH DIKIRIM */}
            {["shipped", "completed", "refund_requested", "refund_approved", "refund_rejected"].includes(order.status) &&
              order.tracking_number && (
                <div className="mt-3 p-3 bg-zinc-50 border rounded-lg inline-block">
                  <p className="text-xs text-muted-foreground uppercase font-bold mb-1">
                    Nomor Resi Pengiriman
                  </p>
                  <p className="font-mono font-black text-lg tracking-widest">
                    {order.tracking_number}
                  </p>
                </div>
              )}
          </div>

          {/* AKSI PELANGGAN */}
          <div className="w-full md:w-auto flex flex-col gap-2">
            {order.status === "pending" && (
              <div className="flex flex-col gap-2 items-end">
                <p className="text-sm font-medium text-yellow-600">
                  Menunggu Pembayaran...
                </p>
                {order.snap_token && (
                  <Button
                    onClick={() => handlePayPending(order.snap_token)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold w-full"
                  >
                    Lanjutkan Pembayaran
                  </Button>
                )}
              </div>
            )}

            {order.status === "processing" && (
              <p className="text-sm font-medium text-purple-600 text-right">
                Penjual sedang menyiapkan paketmu 📦
              </p>
            )}

            {order.status === "shipped" && (
              <>
                <Button
                  onClick={() => confirmDelivery(order.id)}
                  disabled={isLoading === order.id}
                  className="bg-zinc-900 hover:bg-black text-white w-full"
                >
                  {isLoading === order.id ? "Memproses..." : "Pesanan Diterima"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setRefundOrderId(order.id)}
                  className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                >
                  Ajukan Refund
                </Button>
              </>
            )}

            {order.status === "completed" && (
              <Button
                variant="outline"
                disabled
                className="w-full font-bold text-green-700 border-green-200 bg-green-50"
              >
                Transaksi Sukses ✓
              </Button>
            )}

            {order.status === "refund_requested" && (
              <p className="text-sm font-medium text-orange-600 text-right">
                Pengajuan refund sedang ditinjau admin.
              </p>
            )}
            
            {order.status === "refund_approved" && (
              <p className="text-sm font-black text-zinc-800 text-right uppercase">
                Refund Disetujui ✓
              </p>
            )}

            {order.status === "refund_rejected" && (
              <p className="text-sm font-bold text-red-600 text-right">
                Refund Ditolak ✖
              </p>
            )}
          </div>
        </div>
      ))}

      {orders.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          Belum ada riwayat pesanan. Yuk, belanja sekarang!
        </div>
      )}
    </div>
  );
}
