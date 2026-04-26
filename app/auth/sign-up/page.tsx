import Image from "next/image";
import { SignUpForm } from "@/components/sign-up-form";

export default function Page() {
  return (
    // 1. Ubah container utama menjadi grid 2 kolom di layar besar (lg)
    <div className="w-full min-h-screen grid lg:grid-cols-2 overflow-hidden">
      {/* --- BAGIAN KIRI: GAMBAR --- */}
      {/* Gambar akan disembunyikan di layar HP (hidden) dan muncul di laptop (lg:block) */}
      <div className="relative hidden lg:block bg-zinc-900">
        <Image
          src="/logosignup.jpg" // Mengambil gambar dari folder public/
          alt="Gambar Signup"
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
            Sign up now and discover the best sneaker collections this week.
          </p>
        </div>
      </div>

      {/* --- BAGIAN KANAN: FORM SIGNUP --- */}
      {/* Ini adalah modifikasi dari kode aslimu agar berada di sebelah kanan */}
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background">
        <div className="w-full max-w-sm">
          {/* Form signup buatanmu dipanggil di sini */}
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}
