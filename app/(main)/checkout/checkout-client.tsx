"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Wallet, Truck, QrCode } from "lucide-react";

// --- DATA DUMMY (Nantinya ini bisa diambil dari Database / API RajaOngkir) ---
const dataWilayah: Record<string, string[]> = {
  "DKI Jakarta": [
    "Jakarta Selatan",
    "Jakarta Pusat",
    "Jakarta Barat",
    "Jakarta Timur",
    "Jakarta Utara",
  ],
  Banten: ["Tangerang Selatan", "Tangerang", "Serang", "Cilegon"],
  "Jawa Barat": ["Bandung", "Bogor", "Depok", "Bekasi"],
};

const dataKecamatan: Record<string, string[]> = {
  "Jakarta Selatan": [
    "Kebayoran Baru",
    "Kebayoran Lama",
    "Pesanggrahan",
    "Cilandak",
    "Pasar Minggu",
  ],
  "Tangerang Selatan": ["Pamulang", "Ciputat", "Pondok Aren", "Serpong"],
  Bandung: ["Andir", "Astana Anyar", "Babakan Ciparay", "Bandung Kidul"],
};
// -----------------------------------------------------------------------------

export function CheckoutClient({
  subtotal,
  totalItems,
}: {
  subtotal: number;
  totalItems: number;
}) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

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

  // --- STATE UNTUK ALAMAT BERJENJANG ---
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [detailAddress, setDetailAddress] = useState("");

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
    // Validasi Kelengkapan Alamat
    if (
      !phone ||
      !province ||
      !city ||
      !district ||
      !postalCode ||
      !detailAddress
    ) {
      alert("⚠️ Mohon lengkapi semua kolom informasi pengiriman!");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          province,
          city,
          district,
          postalCode,
          detailAddress,
          subtotal,
          totalItems,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal memproses pembayaran");
      }

      // Panggil Snap
      // @ts-expect-error - window.snap is injected by Midtrans script
      window.snap.pay(data.token, {
        onSuccess: function (result: any) {
          console.log("success", result);
          router.push(`/checkout/success?order_id=${data.orderId}`);
        },
        onPending: function (result: any) {
          console.log("pending", result);
          router.push(`/checkout/success?order_id=${data.orderId}&status=pending`);
        },
        onError: function (result: any) {
          console.log("error", result);
          alert("Pembayaran gagal!");
          setIsLoading(false);
        },
        onClose: function () {
          console.log("customer closed the popup");
          alert("Anda menutup popup sebelum menyelesaikan pembayaran.");
          setIsLoading(false);
        },
      });
    } catch (error: any) {
      console.error(error);
      alert(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-10">
      {/* --- KIRI: FORM PENGIRIMAN & PEMBAYARAN --- */}
      <div className="lg:col-span-2 space-y-10">
        {/* --- 1. INFORMASI PENGIRIMAN (DROPDOWN BERJENJANG) --- */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold border-b pb-2">
            Shipping Address
          </h2>

          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="phone">
                Nomor Telepon / WhatsApp <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Contoh: 081234567890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* DROPDOWN PROVINSI */}
              <div className="grid gap-2">
                <Label>
                  Provinsi <span className="text-red-500">*</span>
                </Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={province}
                  onChange={(e) => {
                    setProvince(e.target.value);
                    setCity(""); // Reset kota jika provinsi diganti
                    setDistrict("");
                  }}
                >
                  <option value="">Pilih Provinsi...</option>
                  {Object.keys(dataWilayah).map((prov) => (
                    <option key={prov} value={prov}>
                      {prov}
                    </option>
                  ))}
                </select>
              </div>

              {/* DROPDOWN KOTA (Muncul opsinya bergantung provinsi) */}
              <div className="grid gap-2">
                <Label>
                  Kota / Kabupaten <span className="text-red-500">*</span>
                </Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    setDistrict(""); // Reset kecamatan jika kota diganti
                  }}
                  disabled={!province}
                >
                  <option value="">Pilih Kota...</option>
                  {province &&
                    dataWilayah[province]?.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                </select>
              </div>

              {/* DROPDOWN KECAMATAN */}
              <div className="grid gap-2">
                <Label>
                  Kecamatan <span className="text-red-500">*</span>
                </Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  disabled={!city}
                >
                  <option value="">Pilih Kecamatan...</option>
                  {city &&
                    dataKecamatan[city]?.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                </select>
              </div>

              {/* KODE POS */}
              <div className="grid gap-2">
                <Label>
                  Kode Pos <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  placeholder="Contoh: 12345"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* DETAIL ALAMAT */}
            <div className="grid gap-2">
              <Label>
                Detail Alamat (Nama Jalan, RT/RW, Patokan){" "}
                <span className="text-red-500">*</span>
              </Label>
              <textarea
                placeholder="Contoh: Jl. Sudirman No. 10, RT 01/02, pagar warna hitam..."
                value={detailAddress}
                onChange={(e) => setDetailAddress(e.target.value)}
                required
                className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </div>
        </div>


      </div>

      {/* --- KANAN: RINGKASAN BELANJA --- */}
      <div className="lg:col-span-1">
        <div className="border rounded-xl p-6 bg-zinc-50 space-y-6 sticky top-24">
          <h2 className="text-lg font-bold border-b pb-4">Order Summary</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Subtotal ({totalItems} barang)
              </span>
              <span className="font-medium">{formatIDR(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Biaya Kirim</span>
              <span className="font-medium">{formatIDR(ongkosKirim)}</span>
            </div>
          </div>

          <div className="flex justify-between border-t pt-4">
            <span className="font-bold text-lg">Total</span>
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
