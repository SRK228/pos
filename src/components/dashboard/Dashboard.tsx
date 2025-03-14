import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SalesChart } from "../inventory/SalesChart";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Welcome to Meera Maternity & Fertility Store
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card className="bg-white shadow-sm hover:shadow transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹24,500</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm hover:shadow transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm hover:shadow transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inventory Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹78,350</div>
            <p className="text-xs text-muted-foreground">+2% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm hover:shadow transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Low Stock Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      <SalesChart />

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-white shadow-sm hover:shadow transition-shadow">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  id: "#ORD-001",
                  customer: "John Doe",
                  amount: "₹1,250",
                  status: "Completed",
                },
                {
                  id: "#ORD-002",
                  customer: "Jane Smith",
                  amount: "₹890",
                  status: "Processing",
                },
                {
                  id: "#ORD-003",
                  customer: "Robert Johnson",
                  amount: "₹2,100",
                  status: "Completed",
                },
                {
                  id: "#ORD-004",
                  customer: "Emily Davis",
                  amount: "₹750",
                  status: "Pending",
                },
                {
                  id: "#ORD-005",
                  customer: "Michael Brown",
                  amount: "₹1,500",
                  status: "Completed",
                },
              ].map((order, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg bg-white shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-gray-500">{order.customer}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{order.amount}</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === "Completed"
                          ? "bg-pink-100 text-primary"
                          : order.status === "Processing"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm hover:shadow transition-shadow">
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: "Soft Teddy Bear",
                  category: "Toys",
                  sold: 42,
                  revenue: "₹37,758",
                },
                {
                  name: "Baby Onesie",
                  category: "Clothes",
                  sold: 38,
                  revenue: "₹18,962",
                },
                {
                  name: "Building Blocks",
                  category: "Toys",
                  sold: 35,
                  revenue: "₹45,465",
                },
                {
                  name: "Diapers Pack",
                  category: "Essentials",
                  sold: 31,
                  revenue: "₹9,297",
                },
                {
                  name: "Baby Wipes",
                  category: "Essentials",
                  sold: 28,
                  revenue: "₹4,172",
                },
              ].map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg bg-white shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-md overflow-hidden">
                      {product.category === "Toys" ? (
                        <div className="w-full h-full bg-pink-100 flex items-center justify-center">
                          <span className="text-sm font-bold text-pink-800">
                            T
                          </span>
                        </div>
                      ) : product.category === "Clothes" ? (
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
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        {product.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{product.revenue}</p>
                    <p className="text-sm text-gray-500">
                      {product.sold} units
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
