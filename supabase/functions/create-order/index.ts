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

    // Get order data from request body
    const {
      customer_id,
      items,
      payment_method,
      delivery_method,
      delivery_address,
      notes,
    } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(
        JSON.stringify({ error: "Order must contain at least one item" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

    // Calculate totals
    const subtotal = items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0,
    );
    const taxRate = 0.18; // 18% GST
    const taxAmount = subtotal * taxRate;
    const totalAmount = subtotal + taxAmount;

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        tenant_id: tenantId,
        order_number: orderNumber,
        customer_id: customer_id || null,
        user_id: user.id,
        status: "completed",
        subtotal,
        tax_amount: taxAmount,
        discount_amount: 0,
        total_amount: totalAmount,
        payment_method: payment_method || "cash",
        payment_status: "paid",
        delivery_method: delivery_method || "pickup",
        delivery_address: delivery_address || null,
        notes: notes || null,
      })
      .select()
      .single();

    if (orderError) {
      return new Response(JSON.stringify({ error: "Failed to create order" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    // Add order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.quantity * item.price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      // Rollback order if items insertion fails
      await supabase.from("orders").delete().eq("id", order.id);

      return new Response(
        JSON.stringify({ error: "Failed to add order items" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        },
      );
    }

    // Update inventory for each item
    for (const item of items) {
      // Create inventory transaction
      await supabase.from("inventory_transactions").insert({
        tenant_id: tenantId,
        product_id: item.id,
        transaction_type: "sale",
        quantity: -item.quantity, // Negative for sales
        reference_id: order.id,
        reference_type: "order",
      });

      // Update product stock
      await supabase
        .from("products")
        .update({
          current_stock: supabase.rpc("decrement", {
            row_id: item.id,
            amount: item.quantity,
          }),
        })
        .eq("id", item.id);
    }

    return new Response(
      JSON.stringify({
        success: true,
        order: {
          id: order.id,
          orderNumber: order.order_number,
          total: order.total_amount,
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
