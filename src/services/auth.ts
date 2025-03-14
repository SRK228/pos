import { supabase } from "@/lib/supabase";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  tenant_id: string;
  store_id: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export const authApi = {
  /**
   * Sign in with email and password
   */
  signIn: async (email: string, password: string) => {
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
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });

    if (error) throw error;
    return data;
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
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update the current user's profile
   */
  updateUserProfile: async (userId: string, updates: Partial<UserProfile>) => {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Reset password
   */
  resetPassword: async (email: string) => {
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
