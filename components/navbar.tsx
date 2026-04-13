import Link from "next/link";
import { ShoppingCart, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthButton } from "@/components/auth-button";
import { Suspense } from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"; // <-- Import Sheet untuk Mobile Menu

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md shadow-sm transition-all">
      <div className="container mx-auto flex h-16 sm:h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* --- Bagian Kiri: Logo & Navigasi Desktop --- */}
        <div className="flex items-center gap-8 lg:gap-12">
          <Link href="/" className="flex items-center group">
            <span className="text-xl sm:text-2xl font-black tracking-tighter uppercase italic transition-transform group-hover:scale-105">
              RAFSTORE<span className="text-red-600">DISTRO</span>
            </span>
          </Link>

          {/* Navigasi Khusus Layar Besar (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium">
            <Link
              href="/products"
              className="relative group text-foreground/80 hover:text-foreground transition-colors"
            >
              Produk
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            {/* <Link
              href="/categories"
              className="relative group text-foreground/80 hover:text-foreground transition-colors"
            >
              Kategori
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </Link> */}
            <Link
              href="/new-arrival"
              className="relative group text-foreground/80 hover:text-foreground transition-colors"
            >
              Terbaru
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>
        </div>

        {/* --- Bagian Kanan: Ikon, Pencarian, & Menu HP --- */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Pencarian Khusus Layar Besar */}
          <div className="relative hidden lg:flex items-center w-64 xl:w-80 group">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground group-focus-within:text-red-600 transition-colors" />
            <Input
              placeholder="Cari sepatu impianmu..."
              className="pl-10 h-10 bg-muted/40 border-transparent focus-visible:ring-1 focus-visible:ring-red-600 rounded-full transition-all hover:bg-muted/60"
            />
          </div>

          {/* Ikon Keranjang Belanja */}
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full hover:bg-muted/60"
          >
            <ShoppingCart className="h-5 w-5 text-foreground/80" />
            <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white shadow-sm ring-2 ring-background">
              0
            </span>
          </Button>

          {/* Garis Pemisah (Divider) */}
          <div className="h-6 w-px bg-border mx-1 hidden sm:block"></div>

          {/* Tombol Auth (Login/Profil) */}
          <Suspense
            fallback={
              <div className="h-9 w-20 bg-muted animate-pulse rounded-full" />
            }
          >
            <AuthButton />
          </Suspense>

          {/* --- MOBILE MENU (Sheet) --- */}
          <div className="md:hidden flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-muted/60"
                >
                  <Menu className="h-6 w-6 text-foreground/80" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[350px] flex flex-col pt-12"
              >
                <SheetTitle className="sr-only">
                  Menu Navigasi Mobile
                </SheetTitle>

                {/* Kolom Pencarian di dalam Mobile Menu */}
                <div className="relative w-full mb-6 group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-red-600 transition-colors" />
                  <Input
                    placeholder="Cari sepatu..."
                    className="pl-10 h-12 bg-muted/40 rounded-xl w-full"
                  />
                </div>

                {/* Link Navigasi Mobile */}
                <nav className="flex flex-col gap-4 text-lg font-semibold">
                  <Link
                    href="/products"
                    className="py-2 border-b border-border/50 hover:text-red-600 transition-colors"
                  >
                    Produk
                  </Link>
                  <Link
                    href="/categories"
                    className="py-2 border-b border-border/50 hover:text-red-600 transition-colors"
                  >
                    Kategori
                  </Link>
                  <Link
                    href="/new-arrival"
                    className="py-2 border-b border-border/50 hover:text-red-600 transition-colors"
                  >
                    Terbaru
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
          {/* --------------------------- */}
        </div>
      </div>
    </header>
  );
}
