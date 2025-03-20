import { supabase } from "@/lib/supabase";

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  subscription_plan: string;
  subscription_status: string;
  max_users: number;
  max_stores: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface Store {
  id: string;
  tenant_id: string;
  name: string;
  code: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country: string;
  phone?: string;
  email?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export const tenantApi = {
  /**
   * Resolve tenant by domain or slug
   */
  resolveTenant: async (
    domain?: string,
    slug?: string,
  ): Promise<{ tenant: Tenant; stores: Store[] }> => {
    try {
      console.log("Resolving tenant with domain:", domain, "slug:", slug);
      const { data, error } = await supabase.functions.invoke(
        "tenant-resolver",
        {
          body: { domain, slug },
        },
      );

      if (error) {
        console.error("Error invoking tenant-resolver:", error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error resolving tenant:", error);
      throw error;
    }
  },

  /**
   * Create a new tenant
   */
  createTenant: async (tenant: Partial<Tenant>): Promise<Tenant> => {
    const { data, error } = await supabase
      .from("tenants")
      .insert([tenant])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Create a new store for a tenant
   */
  createStore: async (store: Partial<Store>): Promise<Store> => {
    const { data, error } = await supabase
      .from("stores")
      .insert([store])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get all stores for the current tenant
   */
  getStores: async (): Promise<Store[]> => {
    const { data, error } = await supabase
      .from("stores")
      .select("*")
      .eq("is_active", true);

    if (error) throw error;
    return data || [];
  },

  /**
   * Update tenant information
   */
  updateTenant: async (
    id: string,
    updates: Partial<Tenant>,
  ): Promise<Tenant> => {
    const { data, error } = await supabase
      .from("tenants")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update store information
   */
  updateStore: async (id: string, updates: Partial<Store>): Promise<Store> => {
    const { data, error } = await supabase
      .from("stores")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
