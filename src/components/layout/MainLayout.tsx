import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTenant } from "@/contexts/TenantContext";
import { useAuth } from "@/contexts/AuthContext";
import MeeraLogo from "@/components/MeeraLogo";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentTenant, currentStore, stores, setCurrentStore, isLoading } =
    useTenant();
  const { user, signOut } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50 gap-4">
        <LoadingSpinner size="lg" color="#db2777" />
        <p className="text-xl font-bold text-primary">Loading...</p>
      </div>
    );
  }

  const handleStoreChange = (storeId: string) => {
    const store = stores.find((s) => s.id === storeId);
    if (store) {
      setCurrentStore(store);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect is handled by the auth context
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-pink-50">
      {/* Mobile header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden"
        >
          <Menu className="h-6 w-6" />
        </Button>
        <div className="flex items-center">
          {currentTenant?.logo_url ? (
            <img
              src={currentTenant.logo_url}
              alt={currentTenant.name}
              className="h-8 w-8 mr-2"
            />
          ) : (
            <MeeraLogo className="h-8 mr-2" />
          )}
          <span className="text-xl font-bold text-primary">
            {currentTenant?.name || "YA POS System"}
          </span>
        </div>
        <div className="w-10"></div> {/* Empty div for balance */}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile sidebar (overlay) */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-200 ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          onClick={() => setSidebarOpen(false)}
        ></div>

        {/* Sidebar */}
        <div
          className={`fixed md:static inset-y-0 left-0 z-50 md:z-auto w-64 bg-white transform transition-transform duration-200 ease-in-out md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <Sidebar onNavItemClick={() => setSidebarOpen(false)} />
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-auto w-full">
          <div className="p-4 md:p-6">
            {/* Header with tenant, store, and user info */}
            <div className="flex items-center justify-end gap-2 mb-4">
              {/* Store Switcher */}
              {stores.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9 gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4"
                      >
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                      {currentStore?.name || "Select Store"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuLabel>Switch Store</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {stores.map((store) => (
                      <DropdownMenuItem
                        key={store.id}
                        onClick={() => handleStoreChange(store.id)}
                        className={
                          store.id === currentStore?.id ? "bg-muted" : ""
                        }
                      >
                        {store.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-9 w-9"
                  >
                    <Avatar>
                      <AvatarImage src={user?.avatar_url} />
                      <AvatarFallback>
                        {user?.full_name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>
                    {user?.full_name || "User"}
                  </DropdownMenuLabel>
                  <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                    {user?.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => (window.location.href = "/settings")}
                  >
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-red-500"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
