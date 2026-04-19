/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com", // Mengizinkan gambar dari Unsplash
      },
      // Tambahkan domain lain di bawah ini nanti jika kamu upload gambar ke Supabase Storage
      {
        protocol: "https",
        hostname: "qvtjwwrkvogfvdmselse.supabase.co",
      },
    ],
  },
};

export default nextConfig;
