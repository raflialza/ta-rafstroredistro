import Image from "next/image";
import { LoginForm } from "@/components/login-form";

export default function Page() {
  return (
    // 1. Ubah container utama menjadi grid 2 kolom di layar besar (lg)
    <div className="w-full min-h-screen grid lg:grid-cols-2 overflow-hidden">
      {/* --- BAGIAN KIRI: GAMBAR --- */}
      {/* Gambar akan disembunyikan di layar HP (hidden) dan muncul di laptop (lg:block) */}
      <div className="relative hidden lg:block bg-zinc-900">
        <Image
          src="/logologin.jpg" // Mengambil gambar dari folder public/
          alt="Gambar Login"
          fill
          priority
          className="object-cover object-center opacity-80 mix-blend-overlay"
        />
        {/* Teks atau Logo di atas gambar */}
        <div className="absolute inset-0 flex flex-col items-center justify-between py-24 px-12 text-center text-white">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-4">
            Raf Store
          </h1>
          <p className="text-lg font-medium text-gray-300 max-w-md">
            Log in now and discover the best sneaker collection of the week.
          </p>
        </div>
      </div>

      {/* --- BAGIAN KANAN: FORM LOGIN --- */}
      {/* Ini adalah modifikasi dari kode aslimu agar berada di sebelah kanan */}
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background">
        <div className="w-full max-w-sm">
          {/* Form login buatanmu dipanggil di sini */}
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
