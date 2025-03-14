import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SalesChart } from "../inventory/SalesChart";
import SalesOrderLifecycle from "./SalesOrderLifecycle";
import { Search, Filter, Plus, FileText, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SalesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Sales Management</h1>
        <div className="text-sm text-muted-foreground">
          Meera Maternity & Fertility Store
        </div>
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList className="bg-muted">
          <TabsTrigger
            value="orders"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Orders
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Analytics
          </TabsTrigger>
          <TabsTrigger
            value="lifecycle"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Order Lifecycle
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-2 w-full max-w-md">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search orders..." className="pl-9" />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  className="bg-gradient-meera hover:bg-pink-700"
                  onClick={() => navigate("/sales/new-order")}
                >
                  <Plus className="mr-2 h-4 w-4" /> New Order
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Order #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      {
                        id: "ORD-001",
                        customer: "John Doe",
                        date: "27 Feb 2024",
                        status: "Completed",
                        items: 3,
                        amount: "₹2,500",
                      },
                      {
                        id: "ORD-002",
                        customer: "Jane Smith",
                        date: "26 Feb 2024",
                        status: "Processing",
                        items: 2,
                        amount: "₹1,750",
                      },
                      {
                        id: "ORD-003",
                        customer: "Robert Johnson",
                        date: "25 Feb 2024",
                        status: "Delivered",
                        items: 5,
                        amount: "₹4,300",
                      },
                      {
                        id: "ORD-004",
                        customer: "Emily Davis",
                        date: "24 Feb 2024",
                        status: "Pending",
                        items: 1,
                        amount: "₹899",
                      },
                      {
                        id: "ORD-005",
                        customer: "Michael Brown",
                        date: "23 Feb 2024",
                        status: "Shipped",
                        items: 4,
                        amount: "₹3,200",
                      },
                    ].map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {order.id}
                        </TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>
                          <div
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : order.status === "Processing"
                                  ? "bg-blue-100 text-blue-800"
                                  : order.status === "Delivered"
                                    ? "bg-primary/20 text-primary"
                                    : order.status === "Shipped"
                                      ? "bg-purple-100 text-purple-800"
                                      : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {order.status}
                          </div>
                        </TableCell>
                        <TableCell>{order.items}</TableCell>
                        <TableCell className="text-right">
                          {order.amount}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <SalesChart />

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
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

            <Card>
              <CardHeader>
                <CardTitle>Sales by Channel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      channel: "In-Store",
                      orders: 124,
                      revenue: "₹98,500",
                      percentage: 65,
                    },
                    {
                      channel: "Online",
                      orders: 45,
                      revenue: "₹32,800",
                      percentage: 22,
                    },
                    {
                      channel: "Phone",
                      orders: 18,
                      revenue: "₹12,400",
                      percentage: 8,
                    },
                    {
                      channel: "Mobile App",
                      orders: 12,
                      revenue: "₹8,900",
                      percentage: 5,
                    },
                  ].map((channel, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{channel.channel}</span>
                        <span className="text-sm text-gray-500">
                          {channel.percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{ width: `${channel.percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{channel.orders} orders</span>
                        <span>{channel.revenue}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="lifecycle" className="space-y-4">
          <SalesOrderLifecycle />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesPage;
