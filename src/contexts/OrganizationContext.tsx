import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  currency: string;
  subscription_plan: string;
  subscription_status: string;
}

interface Store {
  id: string;
  name: string;
  code: string;
  organization_id: string;
}

interface OrganizationContextType {
  currentOrganization: Organization | null;
  currentStore: Store | null;
  isLoading: boolean;
  error: string | null;
  setCurrentOrganization: (org: Organization) => void;
  setCurrentStore: (store: Store) => void;
  stores: Store[];
  fetchOrganization: (slug: string) => Promise<void>;
  fetchStores: () => Promise<void>;
  applyTheme: (organization: Organization) => void;
  createOrganization: (
    orgData: Partial<Organization>,
    storeData: Partial<Store>,
    userData: any,
  ) => Promise<string | null>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(
  undefined,
);

export const OrganizationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentOrganization, setCurrentOrganization] =
    useState<Organization | null>(null);
  const [currentStore, setCurrentStore] = useState<Store | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Apply organization theme to the application
  const applyTheme = (organization: Organization) => {
    if (!organization) return;

    const root = document.documentElement;

    // Set primary color
    root.style.setProperty("--primary", organization.primary_color);
    root.style.setProperty("--primary-foreground", "#ffffff");

    // Set secondary color
    const secondaryColor = organization.secondary_color || "#f472b6";
    root.style.setProperty("--secondary", secondaryColor);

    // Set gradient for buttons and headers
    root.style.setProperty("--gradient-start", organization.primary_color);
    root.style.setProperty("--gradient-end", secondaryColor);

    // Update favicon if organization has a logo
    if (organization.logo_url) {
      const favicon = document.querySelector(
        'link[rel="icon"]',
      ) as HTMLLinkElement;
      if (favicon) {
        favicon.href = organization.logo_url;
      }
    }

    // Update document title
    document.title = `${organization.name} - POS System`;
  };

  // Create a new organization
  const createOrganization = async (
    orgData: Partial<Organization>,
    storeData: Partial<Store>,
    userData: any,
  ): Promise<string | null> => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("Creating organization with data:", orgData);
      console.log("Store data:", storeData);

      // For development purposes, create a mock organization without database validation
      // This will be replaced with actual database calls later
      const mockOrg = {
        id: `org-${Date.now()}`,
        name: orgData.name || "Meera Store",
        slug: orgData.slug || `meera-store-${Date.now()}`,
        logo_url: orgData.logo_url || null,
        primary_color: orgData.primary_color || "#db2777",
        secondary_color: orgData.secondary_color || "#f472b6",
        currency: orgData.currency || "INR",
        subscription_plan: orgData.subscription_plan || "basic",
        subscription_status: "active",
      };

      const mockStore = {
        id: `store-${Date.now()}`,
        name: storeData.name || "Main Store",
        code: storeData.code || "STORE01",
        organization_id: mockOrg.id,
      };

      // Set the new organization as current
      setCurrentOrganization(mockOrg as Organization);
      applyTheme(mockOrg as Organization);
      setCurrentStore(mockStore as Store);
      setStores([mockStore as Store]);

      // Save to local storage
      localStorage.setItem("currentOrganizationSlug", mockOrg.slug);
      localStorage.setItem("currentStoreId", mockStore.id);

      // Simulate a delay to mimic API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return mockOrg.slug;

      /* Commented out actual database operations for now
      // 1. Create organization
      const { data: newOrg, error: orgError } = await supabase
        .from("organizations")
        .insert([
          {
            name: orgData.name,
            slug: orgData.slug,
            logo_url: orgData.logo_url,
            primary_color: orgData.primary_color || "#db2777",
            secondary_color: orgData.secondary_color || "#f472b6",
            currency: orgData.currency || "INR",
            subscription_plan: orgData.subscription_plan || "basic",
            subscription_status: "active",
            is_active: true,
          },
        ])
        .select()
        .single();

      if (orgError) throw orgError;
      if (!newOrg) throw new Error("Failed to create organization");

      // 2. Create store
      const { data: newStore, error: storeError } = await supabase
        .from("stores")
        .insert([
          {
            name: storeData.name,
            code: storeData.code,
            organization_id: newOrg.id,
            is_active: true,
          },
        ])
        .select()
        .single();

      if (storeError) throw storeError;
      if (!newStore) throw new Error("Failed to create store");

      // 3. Create user if provided
      if (userData && userData.email && userData.password) {
        const { error: userError } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
          options: {
            data: {
              full_name: userData.fullName,
              organization_id: newOrg.id,
              store_id: newStore.id,
              role: "admin",
            },
          },
        });

        if (userError) throw userError;
      }

      // 4. Set the new organization as current
      setCurrentOrganization(newOrg as Organization);
      applyTheme(newOrg as Organization);
      setCurrentStore(newStore as Store);
      setStores([newStore as Store]);

      // 5. Save to local storage
      localStorage.setItem("currentOrganizationSlug", newOrg.slug);
      localStorage.setItem("currentStoreId", newStore.id);

      return newOrg.slug;
      */
    } catch (err: any) {
      console.error("Error creating organization:", err);
      setError(err.message || "Failed to create organization");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch organization by slug
  const fetchOrganization = async (slug: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // No rows returned
          setError("Organization not found");
          navigate("/onboarding");
          return;
        }
        throw error;
      }

      if (data) {
        setCurrentOrganization(data as Organization);
        applyTheme(data as Organization);
        await fetchStores();
      } else {
        setError("Organization not found");
        navigate("/onboarding");
      }
    } catch (err: any) {
      console.error("Error fetching organization:", err);
      setError(err.message);
      // If there's an error, try to load the default organization
      if (slug !== "meera") {
        try {
          await fetchOrganization("meera");
        } catch (fallbackErr) {
          console.error("Error fetching default organization:", fallbackErr);
          navigate("/onboarding");
        }
      } else {
        navigate("/onboarding");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch stores for the current organization
  const fetchStores = async () => {
    if (!currentOrganization) return;

    try {
      const { data, error } = await supabase
        .from("stores")
        .select("*")
        .eq("organization_id", currentOrganization.id)
        .eq("is_active", true);

      if (error) {
        throw error;
      }

      if (data) {
        setStores(data as Store[]);

        // Set the first store as current if none is selected
        if (data.length > 0) {
          const storedStoreId = localStorage.getItem("currentStoreId");
          const storeToSelect = storedStoreId
            ? data.find((s) => s.id === storedStoreId) || data[0]
            : data[0];

          setCurrentStore(storeToSelect as Store);
          localStorage.setItem("currentStoreId", storeToSelect.id);
        } else {
          setCurrentStore(null);
          localStorage.removeItem("currentStoreId");
        }
      }
    } catch (err: any) {
      console.error("Error fetching stores:", err);
    }
  };

  // Initialize from local storage
  useEffect(() => {
    const initFromLocalStorage = async () => {
      try {
        setIsLoading(true);
        const storedOrgSlug = localStorage.getItem("currentOrganizationSlug");

        if (storedOrgSlug) {
          await fetchOrganization(storedOrgSlug);
        } else {
          // Default to Meera if no organization is stored
          await fetchOrganization("meera");
        }
      } catch (err) {
        console.error("Error initializing from local storage:", err);
        navigate("/onboarding");
      } finally {
        setIsLoading(false);
      }
    };

    initFromLocalStorage();
  }, []);

  // Save current organization to local storage when it changes
  useEffect(() => {
    if (currentOrganization) {
      localStorage.setItem("currentOrganizationSlug", currentOrganization.slug);
    }
  }, [currentOrganization]);

  // Save current store to local storage when it changes
  useEffect(() => {
    if (currentStore) {
      localStorage.setItem("currentStoreId", currentStore.id);
    }
  }, [currentStore]);

  return (
    <OrganizationContext.Provider
      value={{
        currentOrganization,
        currentStore,
        isLoading,
        error,
        setCurrentOrganization,
        setCurrentStore,
        stores,
        fetchOrganization,
        fetchStores,
        applyTheme,
        createOrganization,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error(
      "useOrganization must be used within an OrganizationProvider",
    );
  }
  return context;
};
