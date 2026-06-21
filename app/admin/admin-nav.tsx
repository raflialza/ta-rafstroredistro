"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart } from "lucide-react";

export function AdminNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/orders", label: "Kelola Pesanan", icon: ShoppingCart },
    { href: "/admin/products", label: "Kelola Produk", icon: Package },
  ];

  return (
    <nav className="flex-1 py-6 px-4 space-y-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-colors ${
              isActive
                ? "bg-zinc-100 text-foreground"
                : "hover:bg-zinc-100 text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-5 w-5" /> {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
