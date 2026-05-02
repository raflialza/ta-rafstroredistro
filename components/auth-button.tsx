import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

export async function AuthButton() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  // Mengambil huruf pertama dari email untuk dijadikan inisial
  // Jika tidak ada email, gunakan 'U' (User) sebagai cadangan
  const initial = user?.email ? user.email.charAt(0).toUpperCase() : "U";

  return user ? (
    <div className="flex items-center gap-4">
      <Button asChild variant="ghost" size="sm" className="hidden md:flex font-semibold">
        <Link href="/orders">Pesanan Saya</Link>
      </Button>

      {/* Avatar Inisial */}
      <Link href="/orders">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white uppercase hover:ring-2 hover:ring-red-600 hover:ring-offset-2 transition-all">
          {initial}
        </div>
      </Link>

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
