import { supabase } from "@/lib/supabase";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  tenant_id?: string;
  store_id?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  phone?: string;
  job_title?: string;
  is_active?: boolean;
}

export interface Tenant {
  name: string;
  slug: string;
  primary_color?: string;
  secondary_color?: string;
  logo_url?: string;
}

export interface Store {
  name: string;
  code: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  phone?: string;
  email?: string;
}

export const authApi = {
  /**
   * Sign in with email and password
   */
  signIn: async (email: string, password: string) => {
    // For development, we'll use password auth without email verification
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  /**
   * Sign up a new user
   */
  signUp: async (
    email: string,
    password: string,
    userData: Partial<UserProfile>,
  ) => {
    // For development, we'll use auto-confirm mode to avoid email verification
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
        emailRedirectTo: `${window.location.origin}/login`,
        // Disable email verification for development
        emailConfirmationUrl: `${window.location.origin}/login?verified=true`,
      },
    });

    if (authError) throw authError;

    // Create user profile in the users table
    if (authData.user) {
      try {
        // Create a minimal user profile with only required fields
        const userProfileData = {
          id: authData.user.id,
          email: email,
          full_name: userData.full_name || email.split("@")[0],
          role: userData.role || "user",
          is_active: true,
        };

        const { error: profileError } = await supabase
          .from("users")
          .insert([userProfileData]);

        if (profileError) {
          console.error("Error creating user profile:", profileError);
          throw new Error(
            profileError.message ||
              "Failed to create user profile. Please try again later.",
          );
        }
      } catch (err) {
        console.error("Error creating user profile:", err);
        throw new Error(
          err instanceof Error
            ? err.message
            : "Failed to create user profile. Please try again later.",
        );
      }
    }

    return authData;
  },

  /**
   * Sign up a new user with a new tenant and store
   */
  signUpWithTenant: async (
    email: string,
    password: string,
    userData: Partial<UserProfile>,
    tenantData: Tenant,
    storeData: Store,
  ) => {
    try {
      console.log("Creating tenant and store with user:", {
        email,
        userData,
        tenantData,
        storeData,
      });

      // Use the edge function to create tenant, store, and user
      const { data, error } = await supabase.functions.invoke("create-tenant", {
        body: {
          email,
          password,
          userData,
          tenantData,
          storeData,
        },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error in signUpWithTenant:", error);
      throw error;
    }
  },

  /**
   * Sign out the current user
   */
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Get the current user
   */
  getCurrentUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },

  /**
   * Get the current user's profile
   */
  getUserProfile: async (userId: string): Promise<UserProfile> => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.log("Error fetching user profile from database:", error);
        // If user profile doesn't exist yet, return basic info
        const { data: userData, error: userError } =
          await supabase.auth.getUser();
        if (userError) throw userError;

        if (userData.user && userData.user.id === userId) {
          // Try to fix the user profile using the edge function
          try {
            await supabase.functions.invoke("fix-user-auth", {
              body: { email: userData.user.email },
            });

            // Try to fetch the profile again
            const { data: fixedData, error: fixedError } = await supabase
              .from("users")
              .select("*")
              .eq("id", userId)
              .single();

            if (!fixedError && fixedData) {
              return fixedData;
            }
          } catch (fixError) {
            console.error("Error fixing user profile:", fixError);
          }

          // Return basic info if fix failed
          return {
            id: userId,
            email: userData.user.email || "",
            full_name:
              userData.user.user_metadata?.full_name ||
              userData.user.email?.split("@")[0] ||
              "",
            role: userData.user.user_metadata?.role || "user",
            tenant_id: userData.user.user_metadata?.tenant_id || "",
            store_id: userData.user.user_metadata?.store_id || "",
            created_at: userData.user.created_at || new Date().toISOString(),
            updated_at: userData.user.updated_at || new Date().toISOString(),
            is_active: true,
          };
        }

        throw error;
      }

      return data;
    } catch (err) {
      console.error("Error in getUserProfile:", err);
      throw err;
    }
  },

  /**
   * Fix user authentication issues
   */
  fixUserAuth: async (email: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("fix-user-auth", {
        body: { email },
      });

      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error fixing user auth:", err);
      throw err;
    }
  },

  /**
   * Update the current user's profile
   */
  updateUserProfile: async (userId: string, updates: Partial<UserProfile>) => {
    // Create a safe subset of updates
    const safeUpdates: Record<string, any> = {};

    // Only include basic fields that should always exist
    if (updates.full_name !== undefined)
      safeUpdates.full_name = updates.full_name;
    if (updates.email !== undefined) safeUpdates.email = updates.email;
    if (updates.role !== undefined) safeUpdates.role = updates.role;
    if (updates.phone !== undefined) safeUpdates.phone = updates.phone;
    if (updates.job_title !== undefined)
      safeUpdates.job_title = updates.job_title;
    if (updates.avatar_url !== undefined)
      safeUpdates.avatar_url = updates.avatar_url;

    // Carefully add tenant_id and store_id only if they're provided
    if (updates.tenant_id !== undefined)
      safeUpdates.tenant_id = updates.tenant_id;
    if (updates.store_id !== undefined) safeUpdates.store_id = updates.store_id;

    // First update the user profile in the users table
    const { data, error } = await supabase
      .from("users")
      .update(safeUpdates)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }

    // Then update the user metadata in auth
    const metadataUpdates: Record<string, any> = {};
    if (updates.full_name) metadataUpdates.full_name = updates.full_name;
    if (updates.role) metadataUpdates.role = updates.role;
    if (updates.tenant_id) metadataUpdates.tenant_id = updates.tenant_id;
    if (updates.store_id) metadataUpdates.store_id = updates.store_id;

    if (Object.keys(metadataUpdates).length > 0) {
      const { error: updateError } = await supabase.auth.updateUser({
        data: metadataUpdates,
      });

      if (updateError) throw updateError;
    }

    return data;
  },

  /**
   * Reset password
   */
  resetPassword: async (email: string) => {
    // For development, we'll use a direct reset link
    // In production, this would send an email with a reset link
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;
  },

  /**
   * Update password
   */
  updatePassword: async (password: string) => {
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) throw error;
  },
};
