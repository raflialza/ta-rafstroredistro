import Link from "next/link";
import { Instagram, Youtube, Facebook, Twitter } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

const IconMap: Record<string, React.ElementType> = {
  instagram: Instagram,
  youtube: Youtube,
  facebook: Facebook,
  twitter: Twitter,
};

export async function Footer() {
  const supabase = await createClient();
  
  // Mengambil link dinamis dari database (jika tabelnya sudah ada)
  const { data: footerLinks, error } = await supabase
    .from("footer_links")
    .select("*")
    .order("sort_order", { ascending: true });

  const links = footerLinks || [];

  // Mengelompokkan tautan berdasarkan kategori
  const faqLinks = links.filter((link) => link.section_title === "FAQ");
  const instagramLinks = links.filter((link) => link.section_title === "Instagram");
  const socialLinks = links.filter((link) => link.section_title === "Social");

  return (
    <footer className="bg-[#111111] text-white pt-16 pb-8 border-t border-zinc-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <h2 className="text-3xl font-black italic tracking-tighter uppercase">
              RAFSTORE
              <br />
              DISTRO
            </h2>
            <div className="space-y-1 text-xs text-zinc-400 font-medium">
              <p>100% Money Back Guarantee</p>
              <p>Authentic. Guaranteed.</p>
            </div>
          </div>

          {/* Column 2: Navigation (FAQ) */}
          <div className="space-y-6">
            <h3 className="font-bold text-sm tracking-wide">FAQ</h3>
            <ul className="space-y-4 text-xs text-zinc-400 font-semibold">
              {faqLinks.length > 0 ? (
                faqLinks.map((link) => (
                  <li key={link.id}>
                    <Link href={link.url} className="hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))
              ) : (
                // Fallback jika belum ada data di DB
                <>
                  <li><Link href="#" className="hover:text-white transition-colors">Terms and Conditions</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Buying & Selling Guide</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Rafstore News</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Column 3: Instagram Links */}
          <div className="space-y-6">
            <h3 className="font-bold text-sm tracking-wide">Explore us more on Instagram!</h3>
            <ul className="space-y-4 text-xs text-zinc-400 font-semibold">
              {instagramLinks.length > 0 ? (
                instagramLinks.map((link) => {
                  const Icon = link.icon_name && IconMap[link.icon_name] ? IconMap[link.icon_name] : Instagram;
                  return (
                    <li key={link.id}>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                        <Icon className="w-4 h-4" />
                        <span>{link.label}</span>
                      </a>
                    </li>
                  );
                })
              ) : (
                // Fallback
                <>
                  <li>
                    <a href="#" className="flex items-center gap-2 hover:text-white transition-colors">
                      <Instagram className="w-4 h-4" />
                      <span>Rafstore Distro</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center gap-2 hover:text-white transition-colors">
                      <Instagram className="w-4 h-4" />
                      <span>Rafstore Catalog</span>
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Column 4: Social Media */}
          <div className="space-y-6">
            <h3 className="font-bold text-sm tracking-wide">Keep in touch with us!</h3>
            <div className="flex items-center gap-4 text-zinc-400">
              {socialLinks.length > 0 ? (
                socialLinks.map((link) => {
                  const Icon = link.icon_name && IconMap[link.icon_name] ? IconMap[link.icon_name] : Instagram;
                  return (
                    <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors bg-zinc-800 p-2 rounded-full">
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })
              ) : (
                // Fallback
                <>
                  <a href="#" className="hover:text-white transition-colors bg-zinc-800 p-2 rounded-full"><Instagram className="w-4 h-4" /></a>
                  <a href="#" className="hover:text-white transition-colors bg-zinc-800 p-2 rounded-full"><Youtube className="w-4 h-4" /></a>
                  <a href="#" className="hover:text-white transition-colors bg-zinc-800 p-2 rounded-full"><Facebook className="w-4 h-4" /></a>
                  <a href="#" className="hover:text-white transition-colors bg-zinc-800 p-2 rounded-full"><Twitter className="w-4 h-4" /></a>
                </>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-800 mt-16 pt-8 text-center text-xs text-zinc-500 flex flex-col md:flex-row justify-between items-center gap-4 font-medium">
          <p>© 2026 PT. Rafstore Distro Indonesia. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
