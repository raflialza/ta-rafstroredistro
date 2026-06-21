import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OrdersTable } from "./orders-table";

export default async function AdminOrdersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch all orders
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter">
          Kelola Pesanan
        </h1>
        <p className="text-muted-foreground mt-2">
          Pantau dan proses semua pesanan yang masuk ke toko.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <OrdersTable initialOrders={orders || []} />
      </div>
    </div>
  );
}
