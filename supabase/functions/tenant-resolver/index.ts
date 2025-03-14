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

    const { domain, slug } = await req.json();

    if (!domain && !slug) {
      return new Response(
        JSON.stringify({ error: "Either domain or slug is required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    let query = supabase.from("tenants").select("*");

    if (domain) {
      query = query.eq("domain", domain);
    } else if (slug) {
      query = query.eq("slug", slug);
    }

    const { data: tenant, error } = await query.eq("is_active", true).single();

    if (error) {
      return new Response(
        JSON.stringify({ error: "Tenant not found or inactive" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        },
      );
    }

    // Get stores for this tenant
    const { data: stores, error: storesError } = await supabase
      .from("stores")
      .select("*")
      .eq("tenant_id", tenant.id)
      .eq("is_active", true);

    if (storesError) {
      return new Response(JSON.stringify({ error: "Error fetching stores" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    return new Response(JSON.stringify({ tenant, stores }), {
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
