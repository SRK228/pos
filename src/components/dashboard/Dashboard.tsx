import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { useTenant } from "@/contexts/TenantContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Package,
  CreditCard,
  Users,
  TrendingUp,
  AlertTriangle,
  ShoppingCart,
  ArrowRight,
} from "lucide-react";
import { SalesChart } from "../inventory/SalesChart";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const { currentTenant, currentStore } = useTenant();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Call the dashboard stats edge function
        const { data, error } = await supabase.functions.invoke(
          "supabase-functions-get-dashboard-stats",
          {
            body: {},
          },
        );

        if (error) throw error;

        if (data && data.success) {
          setDashboardData(data.data);
        } else {
          throw new Error("Failed to fetch dashboard data");
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
        // Set some default data for demo purposes
        setDashboardData({
          salesSummary: {
            total_sales: 152500,
            order_count: 187,
            average_order_value: 815.5,
          },
          inventorySummary: {
            total_products: 9,
            total_stock: 227,
            inventory_value: 86750,
            low_stock_count: 3,
          },
          topProducts: [
            {
              product_name: "Soft Teddy Bear",
              category_name: "Toys",
              total_quantity_sold: 42,
              total_revenue: 37758,
            },
            {
              product_name: "Baby Onesie",
              category_name: "Clothes",
              total_quantity_sold: 38,
              total_revenue: 18962,
            },
            {
              product_name: "Building Blocks",
              category_name: "Toys",
              total_quantity_sold: 35,
              total_revenue: 45465,
            },
            {
              product_name: "Diapers Pack",
              category_name: "Essentials",
              total_quantity_sold: 31,
              total_revenue: 27869,
            },
            {
              product_name: "Baby Wipes",
              category_name: "Essentials",
              total_quantity_sold: 28,
              total_revenue: 5572,
            },
          ],
          recentOrders: [
            {
              order_number: "ORD-001",
              customers: { name: "John Doe" },
              order_date: "2024-06-27T14:30:00Z",
              status: "completed",
              total_amount: 2500,
            },
            {
              order_number: "ORD-002",
              customers: { name: "Jane Smith" },
              order_date: "2024-06-26T11:15:00Z",
              status: "completed",
              total_amount: 1750,
            },
            {
              order_number: "ORD-003",
              customers: { name: "Robert Johnson" },
              order_date: "2024-06-25T16:45:00Z",
              status: "completed",
              total_amount: 4300,
            },
          ],
          lowStockItems: [
            {
              product_name: "Baby Shoes",
              category_name: "Clothes",
              current_stock: 3,
              reorder_level: 5,
            },
            {
              product_name: "Building Blocks",
              category_name: "Toys",
              current_stock: 4,
              reorder_level: 5,
            },
            {
              product_name: "Baby Lotion",
              category_name: "Essentials",
              current_stock: 8,
              reorder_level: 10,
            },
          ],
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentTenant, currentStore]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
        <p className="text-center mb-4">{error}</p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-gradient-meera hover:bg-pink-700"
        >
          Try Again
        </Button>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">
          Dashboard
        </h1>
        <div className="text-sm text-muted-foreground">
          {currentTenant?.name || "Meera Maternity & Fertility Store"}
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(dashboardData.salesSummary.total_sales)}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.salesSummary.order_count}
            </div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inventory Value
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(dashboardData.inventorySummary.inventory_value)}
            </div>
            <p className="text-xs text-muted-foreground">+2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Low Stock Items
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.inventorySummary.low_stock_count}
            </div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      <SalesChart />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentOrders.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No recent orders found
                </div>
              ) : (
                dashboardData.recentOrders.map((order, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg bg-white shadow-sm hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{order.order_number}</p>
                      <p className="text-sm text-gray-500">
                        {order.customers?.name || "Guest"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {formatCurrency(order.total_amount)}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === "completed"
                            ? "bg-pink-100 text-primary"
                            : order.status === "processing"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Button
              variant="link"
              className="mt-4 w-full text-primary"
              onClick={() => navigate("/sales")}
            >
              View all orders
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.topProducts.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No product sales data available
                </div>
              ) : (
                dashboardData.topProducts.slice(0, 5).map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg bg-white shadow-sm hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-md overflow-hidden">
                        {product.category_name === "Toys" ? (
                          <div className="w-full h-full bg-pink-100 flex items-center justify-center">
                            <span className="text-sm font-bold text-pink-800">
                              T
                            </span>
                          </div>
                        ) : product.category_name === "Clothes" ? (
                          <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-bold text-blue-800">
                              C
                            </span>
                          </div>
                        ) : (
                          <div className="w-full h-full bg-green-100 flex items-center justify-center">
                            <span className="text-sm font-bold text-green-800">
                              E
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{product.product_name}</p>
                        <p className="text-sm text-gray-500">
                          {product.category_name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {formatCurrency(product.total_revenue)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {product.total_quantity_sold} units
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Button
              variant="link"
              className="mt-4 w-full text-primary"
              onClick={() => navigate("/inventory")}
            >
              View all products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
