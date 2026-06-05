"use client";

import { Search, Loader2 } from "lucide-react";
import { Input } from "./ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State pencarian
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // 1. Fungsi untuk menutup dropdown jika pengguna mengklik di luar area search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 2. Efek Debounce: Mencari data ke Supabase otomatis saat mengetik
  useEffect(() => {
    const fetchResults = async () => {
      // Hanya cari jika panjang ketikan minimal 2 huruf
      if (query.trim().length < 2) {
        setResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      setShowDropdown(true);

      // Tarik maksimal 5 sepatu yang namanya mirip dengan ketikan
      const { data, error } = await supabase
        .from("products")
        .select("id, name, slug, image_url, price")
        .ilike("name", `%${query}%`)
        .limit(5);

      if (!error && data) {
        setResults(data);
      }
      setIsSearching(false);
    };

    // Tunggu 300ms setelah pengguna berhenti mengetik, baru jalankan pencarian (Debounce)
    const timeoutId = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, supabase]); // Supabase dependencies diletakkan agar linter aman

  // 3. Fungsi saat tombol Enter ditekan
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setShowDropdown(false);

    if (query.trim()) {
      router.push(`/?q=${encodeURIComponent(query)}#products`, {
        scroll: false,
      });
    } else {
      router.push(`/#products`, { scroll: false });
    }
  };

  const formatIDR = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    // Membungkus form dengan div relative agar Dropdown posisinya pas di bawah kotak input
    <div
      className="relative w-full max-w-sm hidden sm:block mx-4"
      ref={dropdownRef}
    >
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Cari sepatu impianmu..."
          className="w-full bg-muted/50 pl-10 rounded-full focus-visible:ring-red-600 transition-all"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true); // Tampilkan dropdown saat mulai mengetik lagi
          }}
          onFocus={() => {
            if (query.trim().length >= 2) setShowDropdown(true); // Tampilkan saat input diklik
          }}
        />
      </form>

      {/* --- KOTAK DROPDOWN HASIL PENCARIAN --- */}
      {showDropdown && query.trim().length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-xl shadow-xl overflow-hidden z-50 flex flex-col">
          {/* Kondisi 1: Sedang Loading */}
          {isSearching ? (
            <div className="flex items-center justify-center p-6 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-3" />
              <span className="text-sm font-medium">Mencari sepatu...</span>
            </div>
          ) : results.length > 0 ? (
            /* Kondisi 2: Hasil Ditemukan */
            <>
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`} // Langsung arahkan ke halaman detail sepatu
                  className="flex items-center gap-4 p-3 hover:bg-muted transition-colors border-b last:border-0"
                  onClick={() => setShowDropdown(false)} // Tutup saat diklik
                >
                  <div className="relative w-12 h-12 bg-muted/50 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-contain p-1 mix-blend-multiply"
                    />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-bold truncate">
                      {product.name}
                    </span>
                    <span className="text-xs text-red-600 font-bold mt-0.5">
                      {formatIDR(product.price)}
                    </span>
                  </div>
                </Link>
              ))}

              {/* Tombol pintasan untuk melihat semua grid di halaman depan */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleSearch();
                }}
                className="p-3 text-sm text-center font-bold text-muted-foreground hover:bg-muted hover:text-black transition-colors"
              >
                Lihat semua hasil untuk &quot;{query}&quot;
              </button>
            </>
          ) : (
            /* Kondisi 3: Tidak Ditemukan */
            <div className="p-6 text-center">
              <span className="text-2xl mb-2 block">🧐</span>
              <p className="text-sm text-muted-foreground font-medium">
                Tidak ada sepatu yang cocok dengan &quot;{query}&quot;
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
