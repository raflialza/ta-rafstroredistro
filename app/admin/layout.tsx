import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { AdminNav } from "./admin-nav";

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

  // 2. Proteksi Admin
  const isAdmin =
    user.email?.toLowerCase() === "mrafli.alzaidan1603@gmail.com" ||
    user.user_metadata?.role === "admin";

  if (!isAdmin) {
    redirect("/");
  }

  // 👇 SERVER ACTION UNTUK LOGOUT DAN REDIRECT 👇
  const handleLogout = async () => {
    "use server";
    const supabaseClient = await createClient();
    await supabaseClient.auth.signOut();
    redirect("/auth/login");
  };

  return (
    <div className="min-h-screen flex bg-zinc-50">
      {/* Sidebar Kiri */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col sticky top-0 h-screen">
        <div className="h-20 flex items-center px-6 border-b font-black italic text-xl uppercase">
          RAFSTORE<span className="text-red-600">ADMIN</span>
        </div>

        <AdminNav />

        {/* 👇 BAGIAN BAWAH SIDEBAR: Diubah dari Link menjadi Form Logout 👇 */}
        <div className="p-4 border-t">
          <form action={handleLogout}>
            <button
              type="submit"
              className="flex items-center gap-3 w-full px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg text-sm font-bold transition-colors text-left focus:outline-none"
            >
              <LogOut className="h-5 w-5" /> Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Konten Utama Kanan */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">{children}</main>
    </div>
  );
}
