import Link from "next/link";
import { ShoppingCart, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthButton } from "@/components/auth-button";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server"; // Pastikan path ini benar
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let cartCount = 0;

  // Mengambil jumlah barang di keranjang jika user login
  if (user) {
    const { count } = await supabase
      .from("cart_items")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    cartCount = count || 0;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md shadow-sm transition-all">
      <div className="container mx-auto flex h-16 sm:h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Bagian Kiri: Logo & Navigasi */}
        <div className="flex items-center gap-8 lg:gap-12">
          <Link href="/" className="flex items-center group">
            <span className="text-xl sm:text-2xl font-black tracking-tighter uppercase italic transition-transform group-hover:scale-105">
              RAFSTORE<span className="text-red-600">DISTRO</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium">
            {/* Ubah href ke /products agar mengarah ke daftar sepatu */}
            <Link
              href="/products"
              className="relative group text-foreground/80 hover:text-foreground transition-colors"
            >
              Produk
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full" />
            </Link>
            <Link
              href="/categories"
              className="relative group text-foreground/80 hover:text-foreground transition-colors"
            >
              Kategori
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full" />
            </Link>
          </nav>
        </div>

        {/* Bagian Kanan: Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden lg:flex relative items-center max-w-[200px]">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari sepatu..."
              className="pl-9 h-10 rounded-full"
            />
          </div>

          {/* Tombol Keranjang dengan Badge Angka */}
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full hover:bg-muted/60"
            asChild
          >
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5 text-foreground/80" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white ring-2 ring-background">
                  {cartCount}
                </span>
              )}
            </Link>
          </Button>

          <div className="h-6 w-px bg-border mx-1 hidden sm:block"></div>

          <Suspense
            fallback={
              <div className="h-9 w-20 bg-muted animate-pulse rounded-full" />
            }
          >
            <AuthButton />
          </Suspense>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-full"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="text-left font-black italic">
                  MENU
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 mt-12 px-2">
                <Link
                  href="/products"
                  className="text-2xl font-bold hover:text-red-600"
                >
                  PRODUK
                </Link>
                <Link
                  href="/categories"
                  className="text-2xl font-bold hover:text-red-600"
                >
                  KATEGORI
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
