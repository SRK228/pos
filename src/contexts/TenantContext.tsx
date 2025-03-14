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

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
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
    document.title = `${tenant.name} - YA POS System`;
  };

  // Resolve tenant by domain or slug
  const resolveTenant = async (domain?: string, slug?: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Use the tenant resolver edge function
      const { tenant, stores } = await tenantApi.resolveTenant(domain, slug);

      if (tenant) {
        setCurrentTenant(tenant);
        applyTenantTheme(tenant);
        setStores(stores || []);

        // Set the first store as current if none is selected
        if (stores && stores.length > 0) {
          const storedStoreId = localStorage.getItem("currentStoreId");
          const storeToSelect = storedStoreId
            ? stores.find((s) => s.id === storedStoreId) || stores[0]
            : stores[0];

          setCurrentStore(storeToSelect);
          localStorage.setItem("currentStoreId", storeToSelect.id);
        } else {
          setCurrentStore(null);
          localStorage.removeItem("currentStoreId");
        }

        // Save tenant info to local storage
        localStorage.setItem("currentTenantSlug", tenant.slug);
      } else {
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

        // First try to get tenant from local storage
        const storedTenantSlug = localStorage.getItem("currentTenantSlug");

        // If no stored tenant, try to resolve from hostname
        if (storedTenantSlug) {
          await resolveTenant(undefined, storedTenantSlug);
        } else {
          // Try to resolve from hostname (for custom domains)
          const hostname = window.location.hostname;

          // Skip localhost and known development domains
          if (
            hostname !== "localhost" &&
            !hostname.includes("127.0.0.1") &&
            !hostname.includes("tempolabs.ai")
          ) {
            await resolveTenant(hostname);
          } else {
            // Default to a demo tenant for development
            await resolveTenant(undefined, "meera");
          }
        }
      } catch (err) {
        console.error("Error initializing tenant:", err);
        navigate("/onboarding");
      } finally {
        setIsLoading(false);
      }
    };

    initTenant();
  }, []);

  // Save current tenant to local storage when it changes
  useEffect(() => {
    if (currentTenant) {
      localStorage.setItem("currentTenantSlug", currentTenant.slug);
    }
  }, [currentTenant]);

  // Save current store to local storage when it changes
  useEffect(() => {
    if (currentStore) {
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
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
};
