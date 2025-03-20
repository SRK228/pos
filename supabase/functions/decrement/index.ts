import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseServiceKey = Deno.env.get(
      "SUPABASE_SERVICE_ROLE_KEY",
    ) as string;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { row_id, amount } = await req.json();

    if (!row_id || amount === undefined) {
      return new Response(
        JSON.stringify({ error: "row_id and amount are required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    // Get current stock
    const { data: product, error: getError } = await supabase
      .from("products")
      .select("current_stock")
      .eq("id", row_id)
      .single();

    if (getError) {
      return new Response(JSON.stringify({ error: "Product not found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      });
    }

    // Calculate new stock value
    const newStock = Math.max(0, product.current_stock - amount);

    // Update product stock
    const { data, error } = await supabase
      .from("products")
      .update({ current_stock: newStock })
      .eq("id", row_id)
      .select()
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: "Failed to update stock" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
