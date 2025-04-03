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
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase credentials");
      return new Response(
        JSON.stringify({ error: "Supabase credentials not found" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { email } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Check if user exists
    const { data: existingUser, error: userError } =
      await supabase.auth.admin.getUserByEmail(email);

    if (userError) {
      return new Response(JSON.stringify({ error: userError.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    if (!existingUser?.user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      });
    }

    // Check if user has a profile in public.users
    const { data: userProfile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", existingUser.user.id)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      // PGRST116 is "Results contain 0 rows" - expected if user doesn't have a profile
      return new Response(JSON.stringify({ error: profileError.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    // If user doesn't have a profile, create one
    if (!userProfile) {
      const { error: insertError } = await supabase.from("users").insert([
        {
          id: existingUser.user.id,
          email: existingUser.user.email,
          full_name:
            existingUser.user.user_metadata?.full_name ||
            (existingUser.user.email
              ? existingUser.user.email.split("@")[0]
              : null),
          role: existingUser.user.user_metadata?.role || "user",
          tenant_id: existingUser.user.user_metadata?.tenant_id,
          store_id: existingUser.user.user_metadata?.store_id,
          is_active: true,
        },
      ]);

      if (insertError) {
        return new Response(JSON.stringify({ error: insertError.message }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        });
      }
    }

    return new Response(
      JSON.stringify({
        message: "User authentication fixed successfully",
        user: existingUser.user,
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
