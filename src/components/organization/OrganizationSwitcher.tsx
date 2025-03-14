import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTenant } from "@/contexts/TenantContext";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { Building, ChevronDown, Plus } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
}

const OrganizationSwitcher = () => {
  const { currentTenant, resolveTenant } = useTenant();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("tenants")
          .select("id, name, slug, logo_url")
          .eq("is_active", true)
          .order("name");

        if (error) throw error;
        setOrganizations(data || []);
      } catch (err) {
        console.error("Error fetching organizations:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  const handleOrganizationChange = async (slug: string) => {
    try {
      setIsLoading(true);
      await resolveTenant(undefined, slug);
      navigate("/");
    } catch (err) {
      console.error("Error changing organization:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = () => {
    navigate("/onboarding");
  };

  if (isLoading && !currentTenant) {
    return (
      <Button variant="outline" size="sm" disabled>
        <LoadingSpinner size="sm" />
        <span className="ml-2">Loading...</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-1">
          {isLoading ? (
            <LoadingSpinner size="sm" />
          ) : currentTenant?.logo_url ? (
            <img
              src={currentTenant.logo_url}
              alt={currentTenant.name}
              className="h-5 w-5 rounded-full mr-2"
            />
          ) : (
            <Building className="mr-2 h-4 w-4" />
          )}
          {currentTenant?.name || "Select Organization"}
          <ChevronDown className="h-4 w-4 opacity-50 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[250px]">
        <DropdownMenuLabel>Organizations</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {organizations.length === 0 ? (
          <DropdownMenuItem disabled>
            <span className="text-muted-foreground">
              No organizations found
            </span>
          </DropdownMenuItem>
        ) : (
          organizations.map((org) => (
            <DropdownMenuItem
              key={org.id}
              onClick={() => handleOrganizationChange(org.slug)}
              className={org.id === currentTenant?.id ? "bg-muted" : ""}
            >
              <div className="flex items-center w-full">
                {org.logo_url ? (
                  <img
                    src={org.logo_url}
                    alt={org.name}
                    className="h-5 w-5 rounded-full mr-2"
                  />
                ) : (
                  <Building className="mr-2 h-4 w-4" />
                )}
                <span className="truncate">{org.name}</span>
              </div>
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          <span>Create New Organization</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OrganizationSwitcher;
