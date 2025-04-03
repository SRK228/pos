import { supabase } from "@/lib/supabase";

/**
 * Fix user authentication issues by ensuring the user exists in the public.users table
 * and that auth.users metadata is in sync with public.users
 */
export async function fixUserAuth(email: string) {
  try {
    console.log("Starting fixUserAuth for email:", email);

    // First try to get user by email
    let userId = null;
    let authUser = null;

    // Try to get current user first
    const { data: currentUserData, error: currentUserError } =
      await supabase.auth.getUser();

    if (!currentUserError && currentUserData?.user) {
      console.log("Found current authenticated user:", currentUserData.user.id);
      userId = currentUserData.user.id;
      authUser = currentUserData.user;

      // If email was provided and doesn't match current user, look for that user instead
      if (email && email !== authUser.email) {
        console.log(
          "Email provided doesn't match current user, searching for:",
          email,
        );
        authUser = null;
      }
    }

    // If we don't have a user yet and email was provided, try to find by email
    if (!authUser && email) {
      console.log("Looking up user by email:", email);
      try {
        // Try to get user by email from auth.users
        const { data: userByEmail } =
          await supabase.auth.admin.getUserByEmail(email);

        if (userByEmail?.user) {
          console.log("Found user by email:", userByEmail.user.id);
          userId = userByEmail.user.id;
          authUser = userByEmail.user;
        }
      } catch (adminError) {
        console.error(
          "Error using admin API to get user by email:",
          adminError,
        );
        // Continue with current user if available
      }
    }

    if (!userId || !authUser) {
      return {
        error:
          "No user found. Please make sure you're logged in or provide a valid email.",
      };
    }

    // Check if user exists in public.users table
    const { data: userProfile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError) {
      console.log("User profile not found in public.users, creating it");

      // Create user profile in public.users
      const { error: insertError } = await supabase.from("users").insert([
        {
          id: userId,
          email: authUser.email,
          full_name:
            authUser.user_metadata?.full_name ||
            authUser.email?.split("@")[0] ||
            "",
          role: authUser.user_metadata?.role || "user",
          tenant_id: authUser.user_metadata?.tenant_id,
          store_id: authUser.user_metadata?.store_id,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

      if (insertError) {
        console.error("Error creating user profile:", insertError);
        return { error: insertError.message };
      }

      return { success: true, message: "User profile created successfully" };
    }

    // User profile exists, ensure metadata is in sync
    console.log("User profile found, syncing metadata");

    // Update auth.users metadata to match public.users
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      userId,
      {
        user_metadata: {
          full_name: userProfile.full_name,
          role: userProfile.role,
          tenant_id: userProfile.tenant_id,
          store_id: userProfile.store_id,
        },
      },
    );

    if (updateError) {
      console.error("Error updating user metadata:", updateError);
      return { error: updateError.message };
    }

    return {
      success: true,
      message: "User profile synchronized successfully",
      user: userProfile,
    };
  } catch (error) {
    console.error("Error in fixUserAuth:", error);
    return { error: error.message };
  }
}
