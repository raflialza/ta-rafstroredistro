import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import  OrdersClient  from "./orders-client";

export default async function OrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch user orders
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl min-h-[60vh]">
      <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-8">
        Riwayat Pesanan
      </h1>
      <OrdersClient initialOrders={orders || []} />
    </div>
  );
}
