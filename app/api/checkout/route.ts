import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
// @ts-expect-error - no types available
import midtransClient from "midtrans-client";

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.NEXT_PUBLIC_MIDTRANS_SERVER_KEY || "",
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "",
});

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      phone,
      province,
      city,
      district,
      postalCode,
      detailAddress,
      paymentMethod,
      subtotal,
    } = body;

    const shippingCost = 50000;
    const grossAmount = subtotal + shippingCost;

    // Insert order to database
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        total_amount: grossAmount,
        status: "pending",
        shipping_details: {
          phone,
          province,
          city,
          district,
          postalCode,
          detailAddress,
        },
        payment_type: paymentMethod,
      })
      .select()
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 },
      );
    }

    // Process Midtrans Snap Token
    const parameter = {
      transaction_details: {
        order_id: order.id,
        gross_amount: grossAmount,
      },
      customer_details: {
        first_name: user.user_metadata?.full_name || "Customer",
        email: user.email,
        phone: phone,
      },
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/success`
      }
    };

    const transaction = await snap.createTransaction(parameter);

    // Save the snap token to the order so user can retry payment later
    const { error: updateError } = await supabase
      .from("orders")
      .update({ snap_token: transaction.token })
      .eq("id", order.id);

    if (updateError) {
      console.error("Error saving snap token:", updateError);
      // We don't necessarily want to fail the whole checkout if just the token update fails,
      // but it will log an error.
    }

    return NextResponse.json({ token: transaction.token, orderId: order.id });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
