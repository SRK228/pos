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

    const { email, password, userData, tenantData, storeData } =
      await req.json();

    // Validate required fields
    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    if (!tenantData?.name || !tenantData?.slug) {
      return new Response(
        JSON.stringify({ error: "Tenant name and slug are required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    if (!storeData?.name) {
      return new Response(JSON.stringify({ error: "Store name is required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Start a transaction
    const { data: transaction, error: transactionError } =
      await supabase.rpc("begin_transaction");

    if (transactionError) {
      console.error("Transaction error:", transactionError);
      return new Response(
        JSON.stringify({ error: "Failed to start transaction" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        },
      );
    }

    // 1. Create tenant
    const { data: tenant, error: tenantError } = await supabase
      .from("tenants")
      .insert([
        {
          name: tenantData.name,
          slug: tenantData.slug,
          primary_color: tenantData.primary_color || "#db2777",
          secondary_color: tenantData.secondary_color || "#f472b6",
          subscription_plan: "free",
          subscription_status: "active",
          max_users: 5,
          max_stores: 1,
          is_active: true,
        },
      ])
      .select()
      .single();

    if (tenantError) {
      console.error("Tenant creation error:", tenantError);
      return new Response(
        JSON.stringify({ error: "Failed to create tenant" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        },
      );
    }

    // 2. Create store
    const { data: store, error: storeError } = await supabase
      .from("stores")
      .insert([
        {
          tenant_id: tenant.id,
          name: storeData.name,
          code: storeData.code || storeData.name.substring(0, 5).toUpperCase(),
          address: storeData.address,
          city: storeData.city,
          state: storeData.state,
          postal_code: storeData.postal_code,
          country: storeData.country || "India",
          phone: storeData.phone,
          email: storeData.email || email,
          is_active: true,
        },
      ])
      .select()
      .single();

    if (storeError) {
      console.error("Store creation error:", storeError);
      return new Response(JSON.stringify({ error: "Failed to create store" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    // 3. Create or update user
    let userId;
    let user;

    // Check if user already exists
    const { data: existingUser } =
      await supabase.auth.admin.getUserByEmail(email);

    if (existingUser?.user) {
      // User exists, update their metadata
      userId = existingUser.user.id;
      const { data: updatedUser, error: updateUserError } =
        await supabase.auth.admin.updateUserById(userId, {
          user_metadata: {
            full_name: userData.full_name,
            role: userData.role || "admin",
            tenant_id: tenant.id,
            store_id: store.id,
          },
        });

      if (updateUserError) {
        console.error("User update error:", updateUserError);
        return new Response(
          JSON.stringify({ error: "Failed to update user" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          },
        );
      }

      user = updatedUser;
    } else if (password) {
      // Create new user if password is provided
      const { data: newUser, error: createUserError } =
        await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: {
            full_name: userData.full_name,
            role: userData.role || "admin",
            tenant_id: tenant.id,
            store_id: store.id,
          },
        });

      if (createUserError) {
        console.error("User creation error:", createUserError);
        return new Response(
          JSON.stringify({ error: "Failed to create user" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          },
        );
      }

      userId = newUser.user.id;
      user = newUser;
    } else {
      return new Response(
        JSON.stringify({ error: "Password is required for new users" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    // 4. Create or update user profile in public.users table
    const { data: userProfile, error: userProfileError } = await supabase
      .from("users")
      .upsert([
        {
          id: userId,
          email,
          full_name: userData.full_name || email.split("@")[0] || null,
          role: userData.role || "admin",
          tenant_id: tenant.id,
          store_id: store.id,
          is_active: true,
        },
      ])
      .select()
      .single();

    if (userProfileError) {
      console.error("User profile error:", userProfileError);
      return new Response(
        JSON.stringify({ error: "Failed to create user profile" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        },
      );
    }

    // Commit transaction
    const { error: commitError } = await supabase.rpc("commit_transaction");

    if (commitError) {
      console.error("Commit error:", commitError);
      return new Response(
        JSON.stringify({ error: "Failed to commit transaction" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        },
      );
    }

    return new Response(
      JSON.stringify({
        tenant,
        store,
        user: userProfile,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (err) {
    console.error("Error in create-tenant function:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
