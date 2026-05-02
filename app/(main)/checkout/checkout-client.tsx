"use client";

import { useState } from "react";
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

  const [paymentMethod, setPaymentMethod] = useState<string>("bank_transfer");
  const [isLoading, setIsLoading] = useState(false);

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
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const alamatLengkap = `${detailAddress}, Kec. ${district}, ${city}, ${province} ${postalCode}`;

    alert(
      `Pesanan berhasil!\n\nDikirim ke:\n${alamatLengkap}\n\nTelepon: ${phone}\nTotal: ${formatIDR(totalTagihan)}\nMetode: ${paymentMethod}`,
    );
    setIsLoading(false);
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

        {/* --- 2. PILIH METODE PEMBAYARAN --- */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold border-b pb-2">
            Select Payment Method
          </h2>

          <div className="space-y-4">
            {/* Transfer Bank */}
            <div className="space-y-3">
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
                    <p className="font-bold text-sm">Transfer Bank (BCA)</p>
                    <p className="text-xs text-muted-foreground">
                      Otomatis dicek sistem
                    </p>
                  </div>
                </div>
                <CreditCard className="text-muted-foreground w-6 h-6" />
              </label>

              {paymentMethod === "bank_transfer" && (
                <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl animate-in slide-in-from-top-2">
                  <p className="text-sm text-blue-800 mb-2 font-medium">
                    Nomor Virtual Account Anda:
                  </p>
                  <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-blue-100">
                    <span className="font-mono text-2xl font-black tracking-wider text-blue-950">
                      8077 1234 5678
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-blue-700 border-blue-200 hover:bg-blue-100"
                    >
                      Salin
                    </Button>
                  </div>
                  <p className="text-xs text-blue-600 mt-3">
                    Silakan transfer sesuai total tagihan. Verifikasi otomatis
                    dalam 1-5 menit.
                  </p>
                </div>
              )}
            </div>

            {/* E-WALLET / QRIS */}
            <div className="space-y-3">
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
                    <p className="font-bold text-sm">QRIS / E-Wallet</p>
                    <p className="text-xs text-muted-foreground">
                      GoPay, OVO, Dana, ShopeePay
                    </p>
                  </div>
                </div>
                <Wallet className="text-muted-foreground w-6 h-6" />
              </label>

              {paymentMethod === "ewallet" && (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col items-center text-center animate-in slide-in-from-top-2">
                  <p className="text-sm text-emerald-800 font-medium mb-4">
                    Scan QRIS di bawah ini menggunakan aplikasi E-Wallet
                    pilihanmu:
                  </p>
                  <div className="bg-white p-4 rounded-xl border-2 border-dashed border-emerald-300 shadow-sm">
                    <QrCode className="w-40 h-40 text-emerald-950" />
                  </div>
                </div>
              )}
            </div>

            {/* COD */}
            <div className="space-y-3">
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
                      Siapkan uang tunai saat kurir tiba
                    </p>
                  </div>
                </div>
                <Truck className="text-muted-foreground w-6 h-6" />
              </label>
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
            {isLoading ? "Memproses..." : "Saya Sudah Bayar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
