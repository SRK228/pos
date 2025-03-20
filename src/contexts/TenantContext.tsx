import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { tenantApi, Tenant, Store } from "@/services/tenant";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface TenantContextType {
  currentTenant: Tenant | null;
  currentStore: Store | null;
  stores: Store[];
  isLoading: boolean;
  error: string | null;
  setCurrentStore: (store: Store) => void;
  applyTenantTheme: (tenant: Tenant) => void;
  resolveTenant: (domain?: string, slug?: string) => Promise<void>;
}

export const TenantContext = createContext<TenantContextType | undefined>(
  undefined,
);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [currentStore, setCurrentStore] = useState<Store | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Apply tenant theme to the application
  const applyTenantTheme = (tenant: Tenant) => {
    if (!tenant) return;

    const root = document.documentElement;

    // Set primary color
    root.style.setProperty("--primary", tenant.primary_color);
    root.style.setProperty("--primary-foreground", "#ffffff");

    // Set secondary color
    const secondaryColor = tenant.secondary_color || "#f472b6";
    root.style.setProperty("--secondary", secondaryColor);

    // Set gradient for buttons and headers
    root.style.setProperty("--gradient-start", tenant.primary_color);
    root.style.setProperty("--gradient-end", secondaryColor);

    // Update favicon if tenant has a logo
    if (tenant.logo_url) {
      const favicon = document.querySelector(
        'link[rel="icon"]',
      ) as HTMLLinkElement;
      if (favicon) {
        favicon.href = tenant.logo_url;
      }
    }

    // Update document title
    document.title = `${tenant.name} - Meera POS System`;
  };

  // Resolve tenant by domain or slug
  const resolveTenant = async (domain?: string, slug?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Resolving tenant with domain:", domain, "slug:", slug);

      // Use the tenant resolver edge function
      const { tenant, stores } = await tenantApi.resolveTenant(domain, slug);
      console.log("Tenant resolver response:", { tenant, stores });

      if (tenant) {
        console.log("Tenant found:", tenant);
        setCurrentTenant(tenant);
        applyTenantTheme(tenant);
        setStores(stores || []);

        // Set the first store as current if none is selected
        if (stores && stores.length > 0) {
          const storedStoreId = localStorage.getItem("currentStoreId");
          console.log("Stored store ID:", storedStoreId);
          const storeToSelect = storedStoreId
            ? stores.find((s) => s.id === storedStoreId) || stores[0]
            : stores[0];

          console.log("Selected store:", storeToSelect);
          setCurrentStore(storeToSelect);
          localStorage.setItem("currentStoreId", storeToSelect.id);
        } else {
          console.log("No stores found for tenant");
          setCurrentStore(null);
          localStorage.removeItem("currentStoreId");
        }

        // Save tenant info to local storage
        localStorage.setItem("currentTenantSlug", tenant.slug);
      } else {
        console.log("Tenant not found");
        setError("Tenant not found");
        navigate("/onboarding");
      }
    } catch (err: any) {
      console.error("Error resolving tenant:", err);
      setError(err.message || "Failed to resolve tenant");
      navigate("/onboarding");
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize from local storage or hostname
  useEffect(() => {
    const initTenant = async () => {
      try {
        setIsLoading(true);
        console.log("Initializing tenant context...");

        // First try to get tenant from local storage
        const storedTenantSlug = localStorage.getItem("currentTenantSlug");
        console.log("Stored tenant slug:", storedTenantSlug);

        // Check if we're on the login or onboarding page
        const path = window.location.pathname;
        console.log("Current path:", path);
        const isAuthPage =
          path.includes("/login") ||
          path.includes("/register") ||
          path.includes("/onboarding") ||
          path.includes("/forgot-password") ||
          path.includes("/reset-password");

        // If we're on an auth page, don't try to resolve tenant
        if (isAuthPage) {
          console.log("On auth page, skipping tenant resolution");
          setIsLoading(false);
          return;
        }

        // If stored tenant slug exists, use it
        if (storedTenantSlug) {
          console.log("Resolving tenant from stored slug:", storedTenantSlug);
          await resolveTenant(undefined, storedTenantSlug);
          return;
        }

        // Try to resolve from hostname (for custom domains)
        const hostname = window.location.hostname;
        console.log("Resolving tenant from hostname:", hostname);

        // Skip localhost and known development domains
        if (
          hostname !== "localhost" &&
          !hostname.includes("127.0.0.1") &&
          !hostname.includes("tempolabs.ai")
        ) {
          await resolveTenant(hostname);
          return;
        }

        // Check if user is logged in and has a tenant_id
        const { data } = await supabase.auth.getUser();
        console.log("Current user data:", data?.user);

        if (data?.user) {
          // Get user profile to check for tenant_id
          const { data: userData } = await supabase
            .from("users")
            .select("tenant_id")
            .eq("id", data.user.id)
            .single();

          console.log("User profile data:", userData);

          if (userData?.tenant_id) {
            console.log("Found tenant_id in user profile:", userData.tenant_id);
            // Get tenant slug from tenant_id
            const { data: tenantData } = await supabase
              .from("tenants")
              .select("slug")
              .eq("id", userData.tenant_id)
              .single();

            console.log("Tenant data:", tenantData);

            if (tenantData?.slug) {
              console.log(
                "Resolving tenant from user's tenant_id slug:",
                tenantData.slug,
              );
              await resolveTenant(undefined, tenantData.slug);
              return;
            }
          }
        }

        // If we get here, no tenant was found
        console.log("No tenant found, redirecting to onboarding");
        navigate("/onboarding");
      } catch (err) {
        console.error("Error initializing tenant:", err);
        navigate("/onboarding");
      } finally {
        setIsLoading(false);
      }
    };

    initTenant();
  }, [navigate]);

  // Save current tenant to local storage when it changes
  useEffect(() => {
    if (currentTenant) {
      console.log("Saving tenant slug to local storage:", currentTenant.slug);
      localStorage.setItem("currentTenantSlug", currentTenant.slug);
    }
  }, [currentTenant]);

  // Save current store to local storage when it changes
  useEffect(() => {
    if (currentStore) {
      console.log("Saving store ID to local storage:", currentStore.id);
      localStorage.setItem("currentStoreId", currentStore.id);
    }
  }, [currentStore]);

  // If still loading, show a loading spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50 gap-4">
        <LoadingSpinner size="lg" color="#db2777" />
        <p className="text-xl font-bold text-primary">Loading...</p>
      </div>
    );
  }

  return (
    <TenantContext.Provider
      value={{
        currentTenant,
        currentStore,
        stores,
        isLoading,
        error,
        setCurrentStore,
        applyTenantTheme,
        resolveTenant,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
}
