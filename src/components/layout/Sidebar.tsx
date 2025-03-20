import React from "react";
import { useNavigate } from "react-router-dom";
import { useTenant } from "@/contexts/TenantContext";
import MeeraLogo from "@/components/MeeraLogo";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Receipt,
  BarChart3,
  FileText,
  Users,
  Settings,
} from "lucide-react";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({
  icon,
  label,
  href,
  active,
  onClick,
}: SidebarItemProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(href);
    if (onClick) onClick();
  };

  return (
    <button
      className={`flex items-center space-x-2 w-full px-3 py-2 rounded-md transition-colors ${active ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"}`}
      onClick={handleClick}
    >
      <div className="flex-shrink-0">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};

interface SidebarProps {
  onNavItemClick?: () => void;
}

export function Sidebar({ onNavItemClick }: SidebarProps) {
  const { currentTenant } = useTenant();
  const pathname = window.location.pathname;

  const routes = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      label: "POS",
      href: "/pos",
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      label: "Inventory",
      href: "/inventory",
      icon: <Package className="h-5 w-5" />,
    },
    {
      label: "Billing",
      href: "/billing",
      icon: <Receipt className="h-5 w-5" />,
    },
    {
      label: "Sales",
      href: "/sales",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      label: "Reports",
      href: "/reports",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      label: "Staff",
      href: "/staff",
      icon: <Users className="h-5 w-5" />,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <div className="flex flex-col h-full bg-primary">
      <div className="p-4 flex items-center">
        <div className="flex items-center">
          <MeeraLogo className="h-8 text-white" />
          <span className="text-xl font-bold text-white ml-2">
            {currentTenant?.name || "POS System"}
          </span>
        </div>
      </div>
      <div className="flex-1 py-2 md:py-4 px-2 md:px-3 space-x-1 md:space-x-0 md:space-y-1 overflow-x-auto md:overflow-y-auto flex flex-row md:flex-col">
        {routes.map((route) => (
          <SidebarItem
            key={route.href}
            icon={route.icon}
            label={route.label}
            href={route.href}
            active={pathname === route.href}
            onClick={onNavItemClick}
          />
        ))}
      </div>
    </div>
  );
}
