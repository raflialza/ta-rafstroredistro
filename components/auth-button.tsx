import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlusCircle, LayoutDashboard } from "lucide-react";

export async function AuthButton() {
  const supabase = await createClient();

  // Menggunakan getUser() yang valid dan sinkron dengan navbar serta layout
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Mengambil huruf pertama dari email untuk dijadikan inisial avatar
  const initial = user?.email ? user.email.charAt(0).toUpperCase() : "U";

  // Cek hak akses admin (Gunakan toLowerCase() untuk menghindari error typo kapital)
  const isAdmin =
    user?.email?.toLowerCase() === "mrafli.alzaidan1603@gmail.com" ||
    user?.user_metadata?.role === "admin";

  return user ? (
    <div className="flex items-center gap-4">
      {/* Tombol Pesanan Saya (Tetap berada di luar) */}
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="hidden md:flex font-semibold"
      >
        <Link href="/orders">Pesanan Saya</Link>
      </Button>

      {/* Avatar Inisial dengan Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white uppercase hover:ring-2 hover:ring-red-600 hover:ring-offset-2 transition-all focus:outline-none">
            {initial}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-64 p-2">
          {/* Label Email Informasi Akun */}
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Akun Saya</p>
              <p className="text-xs leading-none text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {/* MENU KHUSUS ADMIN: Hanya tampil jika email cocok atau role admin di-set */}
          {isAdmin && (
            <>
              <DropdownMenuItem
                asChild
                className="cursor-pointer py-3 text-red-600 font-bold focus:bg-red-50 focus:text-red-700"
              >
                <Link href="/admin" className="flex items-center w-full">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard Admin</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}

          {/* Opsi Tambah Akun / Switch Akun */}
          <DropdownMenuItem asChild className="cursor-pointer py-3">
            <Link href="/auth/login" className="flex items-center w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              <span>Tambah Akun</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Tombol Logout (Tetap berada di luar) */}
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
