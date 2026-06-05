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
import { PlusCircle } from "lucide-react";

export async function AuthButton() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  // Mengambil huruf pertama dari email untuk dijadikan inisial
  const initial = user?.email ? user.email.charAt(0).toUpperCase() : "U";

  return user ? (
    <div className="flex items-center gap-4">
      {/* 1. Tombol Pesanan Saya (Tetap di luar sesuai kode aslimu) */}
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="hidden md:flex font-semibold"
      >
        <Link href="/orders">Pesanan Saya</Link>
      </Button>

      {/* 2. Avatar Inisial yang sekarang menjadi Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {/* Tombol inisial dipertahankan gaya CSS aslinya */}
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white uppercase hover:ring-2 hover:ring-red-600 hover:ring-offset-2 transition-all focus:outline-none">
            {initial}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-64 p-2">
          {/* Label Email */}
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Akun Saya</p>
              <p className="text-xs leading-none text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {/* Opsi Tambah Akun (Sekarang mengarah ke halaman Login) */}
          <DropdownMenuItem asChild className="cursor-pointer py-3">
            <Link href="/auth/login" className="flex items-center w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              <span>Tambah Akun</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 3. Tombol Logout (Tetap di luar) */}
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
