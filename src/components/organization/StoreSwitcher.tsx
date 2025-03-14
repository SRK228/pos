import React from "react";
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
import { Store, ChevronDown, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StoreSwitcher = () => {
  const { currentStore, stores, setCurrentStore, currentTenant } = useTenant();
  const navigate = useNavigate();

  if (!currentTenant) {
    return null;
  }

  // If there are no stores or only one store, show a button to add a new store
  if (!currentStore || stores.length === 0) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="h-9 gap-1"
        onClick={() => navigate("/settings")}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Store
      </Button>
    );
  }

  // If there's only one store, show it but disable the dropdown
  if (stores.length === 1) {
    return (
      <Button variant="outline" size="sm" className="h-9 gap-1">
        <Store className="mr-2 h-4 w-4" />
        {currentStore.name}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-1">
          <Store className="mr-2 h-4 w-4" />
          {currentStore.name}
          <ChevronDown className="h-4 w-4 opacity-50 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[250px]">
        <DropdownMenuLabel>Switch Store</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {stores.map((store) => (
          <DropdownMenuItem
            key={store.id}
            onClick={() => setCurrentStore(store)}
            className={store.id === currentStore.id ? "bg-muted" : ""}
          >
            <div className="flex items-center w-full">
              <Store className="mr-2 h-4 w-4" />
              <span className="truncate">{store.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {store.code}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/settings")}>
          <Plus className="mr-2 h-4 w-4" />
          <span>Add New Store</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StoreSwitcher;
