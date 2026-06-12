import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart, LogOut } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Cek apakah user sudah login
  if (!user) {
    redirect("/auth/login");
  }

  // 2. Proteksi Admin: Cek berdasarkan email kamu ATAU metadata role
  // Ganti "owner@rafstore.com" dengan email utama yang ingin kamu pakai sebagai admin
  const isAdmin =
    user.email === "mrafli.alzaidan1603@gmail.com" ||
    user.user_metadata?.role === "admin";

  if (!isAdmin) {
    // Jika bukan admin, tendang langsung ke beranda pelanggan
    redirect("/");
  }

  // 2. Keamanan Ekstra (Opsional): Hanya email tertentu yang boleh masuk
  // Ganti dengan email milikmu sendiri
  // if (user.email !== "admin@emailkamu.com") {
  //   redirect("/");
  // }

  return (
    <div className="min-h-screen flex bg-zinc-50">
      {/* Sidebar Kiri */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col sticky top-0 h-screen">
        <div className="h-20 flex items-center px-6 border-b font-black italic text-xl uppercase">
          RAFSTORE<span className="text-red-600">ADMIN</span>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3 py-2.5 bg-zinc-100 rounded-lg text-sm font-bold transition-colors"
          >
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-3 px-3 py-2.5 hover:bg-zinc-100 text-muted-foreground hover:text-foreground rounded-lg text-sm font-bold transition-colors"
          >
            <ShoppingCart className="h-5 w-5" /> Kelola Pesanan
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center gap-3 px-3 py-2.5 hover:bg-zinc-100 text-muted-foreground hover:text-foreground rounded-lg text-sm font-bold transition-colors"
          >
            <Package className="h-5 w-5" /> Kelola Produk
          </Link>
        </nav>

        <div className="p-4 border-t">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-bold transition-colors"
          >
            <LogOut className="h-5 w-5" /> Kembali ke Toko
          </Link>
        </div>
      </aside>

      {/* Konten Utama Kanan */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">{children}</main>
    </div>
  );
}
