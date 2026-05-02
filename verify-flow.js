// Environment loaded via --env-file
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyFlow() {
  console.log("Checking recent orders in Supabase...");

  // Since we don't have the service role key, we might be blocked by RLS if we query orders without logging in.
  // We'll try querying orders directly first.
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error fetching orders (possibly due to RLS):", error.message);
  } else if (data && data.length > 0) {
    console.log("✅ Successfully retrieved recent orders:");
    console.table(
      data.map((o) => ({
        id: o.id,
        user_id: o.user_id,
        total_amount: o.total_amount,
        status: o.status,
        created_at: o.created_at,
      }))
    );
  } else {
    console.log("No orders found or cannot read due to RLS.");
  }
}

verifyFlow();
