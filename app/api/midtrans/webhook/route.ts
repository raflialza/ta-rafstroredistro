import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

// Note: To update the database from a webhook without an active user session,
// we use the Supabase Service Role Key which bypasses Row Level Security.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
    } = body;

    const serverKey = process.env.NEXT_PUBLIC_MIDTRANS_SERVER_KEY || "";
    const generatedSignature = crypto
      .createHash("sha512")
      .update(order_id + status_code + gross_amount + serverKey)
      .digest("hex");

    if (generatedSignature !== signature_key) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    let status = "pending";
    if (
      transaction_status === "settlement" ||
      transaction_status === "capture"
    ) {
      status = "paid";
    } else if (
      transaction_status === "cancel" ||
      transaction_status === "expire" ||
      transaction_status === "deny"
    ) {
      status = "cancelled";
    }

    const { error } = await supabase
      .from("orders")
      .update({ status: status })
      .eq("id", order_id);

    if (error) {
      console.error("Failed to update order status:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
