import React, { useState } from "react";
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
import { Plus, Search, Filter, Edit, Trash2 } from "lucide-react";
import { SalesChart } from "./SalesChart";
import ItemGroups from "./ItemGroups";
import InventoryAdjustment from "./InventoryAdjustment";

const InventoryDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("inventory");

  const inventoryItems = [
    {
      id: "1",
      name: "Soft Teddy Bear",
      sku: "TOY-001",
      category: "Toys",
      stock: 25,
      reorderLevel: 10,
      price: "₹899",
    },
    {
      id: "2",
      name: "Building Blocks",
      sku: "TOY-002",
      category: "Toys",
      stock: 15,
      reorderLevel: 5,
      price: "₹1,299",
    },
    {
      id: "3",
      name: "Baby Onesie",
      sku: "CLO-001",
      category: "Clothes",
      stock: 30,
      reorderLevel: 10,
      price: "₹499",
    },
    {
      id: "4",
      name: "Kids T-Shirt",
      sku: "CLO-002",
      category: "Clothes",
      stock: 20,
      reorderLevel: 8,
      price: "₹399",
    },
    {
      id: "5",
      name: "Baby Shoes",
      sku: "CLO-003",
      category: "Clothes",
      stock: 12,
      reorderLevel: 5,
      price: "₹699",
    },
    {
      id: "6",
      name: "Baby Wipes",
      sku: "ESS-001",
      category: "Essentials",
      stock: 50,
      reorderLevel: 20,
      price: "₹199",
    },
    {
      id: "7",
      name: "Diapers Pack",
      sku: "ESS-002",
      category: "Essentials",
      stock: 40,
      reorderLevel: 15,
      price: "₹899",
    },
    {
      id: "8",
      name: "Baby Lotion",
      sku: "ESS-003",
      category: "Essentials",
      stock: 35,
      reorderLevel: 10,
      price: "₹299",
    },
  ];

  const filteredItems = inventoryItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalProducts = inventoryItems.length;
  const totalStock = inventoryItems.reduce((sum, item) => sum + item.stock, 0);
  const lowStockItems = inventoryItems.filter(
    (item) => item.stock <= item.reorderLevel,
  ).length;
  const inventoryValue = inventoryItems
    .reduce(
      (sum, item) =>
        sum + item.stock * parseInt(item.price.replace(/[^0-9]/g, "")),
      0,
    )
    .toLocaleString("en-IN");

  // Direct component rendering instead of iframe for better performance
  if (activeTab === "item-groups") {
    return <ItemGroups />;
  }

  if (activeTab === "adjustments") {
    return <InventoryAdjustment />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">
          Inventory Management
        </h1>
        <div className="text-sm text-muted-foreground">
          Meera Maternity & Fertility Store
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Across{" "}
              {
                Object.keys(
                  inventoryItems.reduce(
                    (acc, item) => ({ ...acc, [item.category]: true }),
                    {},
                  ),
                ).length
              }{" "}
              categories
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStock}</div>
            <p className="text-xs text-muted-foreground">
              Units currently in stock
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inventory Value
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{inventoryValue}</div>
            <p className="text-xs text-muted-foreground">
              Total value of inventory
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Low Stock Items
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockItems}</div>
            <p className="text-xs text-muted-foreground">
              Items below reorder level
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="bg-muted overflow-x-auto flex whitespace-nowrap">
          <TabsTrigger
            value="inventory"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Inventory
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Activity History
          </TabsTrigger>
          <TabsTrigger
            value="purchase-orders"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Purchase Orders
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Analytics
          </TabsTrigger>
          <TabsTrigger
            value="item-groups"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Item Groups
          </TabsTrigger>
          <TabsTrigger
            value="adjustments"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Adjustments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex gap-2 w-full max-w-md flex-1">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search inventory..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
                <Button className="bg-gradient-meera hover:bg-pink-700 w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" /> Add Product
                </Button>
              </div>

              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Stock</TableHead>
                      <TableHead className="text-right">
                        Reorder Level
                      </TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.name}
                        </TableCell>
                        <TableCell>{item.sku}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className="text-right">
                          <div
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              item.stock <= item.reorderLevel
                                ? "bg-red-100 text-red-800"
                                : item.stock <= item.reorderLevel * 1.5
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                            }`}
                          >
                            {item.stock}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {item.reorderLevel}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.price}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
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

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>User</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      {
                        id: "1",
                        datetime: "2024-02-27 14:30",
                        product: "Soft Teddy Bear",
                        type: "Sale",
                        quantity: -2,
                        reference: "ORD-001",
                        user: "Rajesh",
                      },
                      {
                        id: "2",
                        datetime: "2024-02-27 11:15",
                        product: "Diapers Pack",
                        type: "Sale",
                        quantity: -1,
                        reference: "ORD-002",
                        user: "Priya",
                      },
                      {
                        id: "3",
                        datetime: "2024-02-26 16:45",
                        product: "Building Blocks",
                        type: "Purchase",
                        quantity: 10,
                        reference: "PO-001",
                        user: "Amit",
                      },
                      {
                        id: "4",
                        datetime: "2024-02-26 10:30",
                        product: "Baby Wipes",
                        type: "Adjustment",
                        quantity: -5,
                        reference: "ADJ-001",
                        user: "Sneha",
                      },
                      {
                        id: "5",
                        datetime: "2024-02-25 15:20",
                        product: "Baby Onesie",
                        type: "Sale",
                        quantity: -3,
                        reference: "ORD-003",
                        user: "Rajesh",
                      },
                    ].map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell>{activity.datetime}</TableCell>
                        <TableCell className="font-medium">
                          {activity.product}
                        </TableCell>
                        <TableCell>
                          <div
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              activity.type === "Sale"
                                ? "bg-blue-100 text-blue-800"
                                : activity.type === "Purchase"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {activity.type}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={`font-medium ${
                              activity.quantity > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {activity.quantity > 0
                              ? `+${activity.quantity}`
                              : activity.quantity}
                          </span>
                        </TableCell>
                        <TableCell>{activity.reference}</TableCell>
                        <TableCell>{activity.user}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchase-orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex gap-2 w-full max-w-md flex-1">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search purchase orders..."
                      className="pl-9"
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
                <Button className="bg-gradient-meera hover:bg-pink-700 w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" /> Create Purchase Order
                </Button>
              </div>

              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>PO Number</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Expected Delivery</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      {
                        id: "PO-001",
                        vendor: "Kids Toys Inc.",
                        date: "2024-02-26",
                        delivery: "2024-03-05",
                        status: "Ordered",
                        total: "₹12,500",
                      },
                      {
                        id: "PO-002",
                        vendor: "Baby Essentials Ltd.",
                        date: "2024-02-20",
                        delivery: "2024-03-01",
                        status: "Received",
                        total: "₹8,750",
                      },
                      {
                        id: "PO-003",
                        vendor: "Kids Clothing Co.",
                        date: "2024-02-15",
                        delivery: "2024-02-25",
                        status: "Partial",
                        total: "₹15,300",
                      },
                    ].map((po) => (
                      <TableRow key={po.id}>
                        <TableCell className="font-medium">{po.id}</TableCell>
                        <TableCell>{po.vendor}</TableCell>
                        <TableCell>{po.date}</TableCell>
                        <TableCell>{po.delivery}</TableCell>
                        <TableCell>
                          <div
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              po.status === "Ordered"
                                ? "bg-blue-100 text-blue-800"
                                : po.status === "Received"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {po.status}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{po.total}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
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
                      revenue: "₹27,869",
                    },
                    {
                      name: "Baby Wipes",
                      category: "Essentials",
                      sold: 28,
                      revenue: "₹5,572",
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
                <CardTitle>Low Stock Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inventoryItems
                    .filter((item) => item.stock <= item.reorderLevel)
                    .map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded-lg bg-white shadow-sm hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-md overflow-hidden">
                            {item.category === "Toys" ? (
                              <div className="w-full h-full bg-pink-100 flex items-center justify-center">
                                <span className="text-sm font-bold text-pink-800">
                                  T
                                </span>
                              </div>
                            ) : item.category === "Clothes" ? (
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
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">
                              {item.category}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-red-600">
                            {item.stock} in stock
                          </p>
                          <p className="text-sm text-gray-500">
                            Reorder level: {item.reorderLevel}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryDashboard;
