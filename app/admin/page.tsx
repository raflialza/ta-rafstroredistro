import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, DollarSign } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // 1. Ambil total produk
  const { count: productsCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  // 2. Ambil total pesanan
  const { count: ordersCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true });

  // 3. Hitung Total Pendapatan HANYA dari semua order yang sudah "paid"
  const { data: paidOrders } = await supabase
    .from("orders")
    .select("total_amount")
    .eq("status", "paid");

  // Menjumlahkan semua total_amount dari seluruh transaksi paid yang ada
  const totalRevenue =
    paidOrders?.reduce((sum, order) => sum + Number(order.total_amount), 0) ||
    0;

  // 👇 TAMBAHAN CONSOLE LOG UNTUK DEBUGGING 👇
  console.log(" ");
  console.log("=== 🚀 DEBUG DATA DASHBOARD ADMIN 🚀 ===");
  console.log("Total Produk di Database:", productsCount);
  console.log("Total Pesanan Masuk (Semua):", ordersCount);
  console.log("Isi Data Pesanan [Paid]:", paidOrders);
  console.log("Total Pendapatan Terhitung:", totalRevenue);
  console.log("========================================");
  console.log(" ");

  const formatIDR = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-black tracking-tight uppercase italic">
          Dashboard Admin
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Ringkasan performa toko Rafstore Distro.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* KARTU PENDAPATAN */}
        <Card className="border-2 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Total Pendapatan
            </CardTitle>
            <div className="p-2 bg-green-100 rounded-full">
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-green-600">
              {formatIDR(totalRevenue)}
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-1">
              Dari pesanan yang berhasil dibayar
            </p>
          </CardContent>
        </Card>

        {/* KARTU PESANAN */}
        <Card className="border-2 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Total Pesanan
            </CardTitle>
            <div className="p-2 bg-blue-100 rounded-full">
              <ShoppingCart className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{ordersCount || 0}</div>
            <p className="text-xs font-medium text-muted-foreground mt-1">
              Seluruh pesanan masuk
            </p>
          </CardContent>
        </Card>

        {/* KARTU PRODUK */}
        <Card className="border-2 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Total Produk
            </CardTitle>
            <div className="p-2 bg-orange-100 rounded-full">
              <Package className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{productsCount || 0}</div>
            <p className="text-xs font-medium text-muted-foreground mt-1">
              Sepatu aktif di katalog
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
