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

    // Get the JWT token from the request headers
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing Authorization header" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        },
      );
    }

    // Get the user's tenant_id from their JWT claims
    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const tenantId = user.app_metadata?.tenant_id;
    if (!tenantId) {
      return new Response(
        JSON.stringify({ error: "User has no tenant assigned" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 403,
        },
      );
    }

    // Get dashboard stats
    const { data: salesSummary, error: salesError } = await supabase.rpc(
      "get_sales_summary",
      { p_tenant_id: tenantId },
    );

    const { data: inventorySummary, error: inventoryError } =
      await supabase.rpc("get_inventory_summary", { p_tenant_id: tenantId });

    // Get top selling products
    const { data: topProducts, error: productsError } = await supabase
      .from("sales_by_product")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("total_revenue", { ascending: false })
      .limit(5);

    // Get recent orders
    const { data: recentOrders, error: ordersError } = await supabase
      .from("orders")
      .select("*, customers(name)")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false })
      .limit(5);

    // Get low stock items
    const { data: lowStockItems, error: lowStockError } = await supabase
      .from("inventory_summary")
      .select("*")
      .eq("tenant_id", tenantId)
      .eq("stock_status", "Low Stock")
      .limit(10);

    if (
      salesError ||
      inventoryError ||
      productsError ||
      ordersError ||
      lowStockError
    ) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch dashboard data" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          salesSummary: salesSummary || {
            total_sales: 0,
            order_count: 0,
            average_order_value: 0,
          },
          inventorySummary: inventorySummary || {
            total_products: 0,
            total_stock: 0,
            inventory_value: 0,
            low_stock_count: 0,
          },
          topProducts: topProducts || [],
          recentOrders: recentOrders || [],
          lowStockItems: lowStockItems || [],
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
