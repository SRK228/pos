import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, FileText, Upload, Info, Search } from "lucide-react";
import BillForm from "./BillForm";
import BillsList from "./BillsList";
import VendorsList from "./VendorsList";
import PaymentsList from "./PaymentsList";
import PurchaseOrderForm from "./PurchaseOrderForm";
import PaymentLifecycle from "./PaymentLifecycle";

const BillingPage = () => {
  const [activeTab, setActiveTab] = useState("bills");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewPurchaseOrderForm, setShowNewPurchaseOrderForm] =
    useState(false);
  const [purchaseOrders, setPurchaseOrders] = useState([
    {
      id: "PO-00001",
      vendor: "Kids Toys Inc.",
      date: "27 Feb 2024",
      status: "Open",
      amount: "₹12,500",
    },
    {
      id: "PO-00002",
      vendor: "Baby Essentials Ltd.",
      date: "25 Feb 2024",
      status: "Received",
      amount: "₹18,750",
    },
    {
      id: "PO-00003",
      vendor: "Kids Clothing Co.",
      date: "20 Feb 2024",
      status: "Closed",
      amount: "₹22,300",
    },
  ]);

  const [vendors, setVendors] = useState([
    { id: "vendor1", name: "Kids Toys Inc." },
    { id: "vendor2", name: "Baby Essentials Ltd." },
    { id: "vendor3", name: "Kids Clothing Co." },
  ]);

  const filteredPurchaseOrders = purchaseOrders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.vendor.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDeletePurchaseOrder = (id: string) => {
    if (confirm("Are you sure you want to delete this purchase order?")) {
      setPurchaseOrders(purchaseOrders.filter((order) => order.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Billing Management</h1>
        <div className="text-sm text-muted-foreground">
          Meera Maternity & Fertility Store
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="bg-muted">
          <TabsTrigger
            value="bills"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Bills
          </TabsTrigger>
          <TabsTrigger
            value="vendors"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Vendors
          </TabsTrigger>
          <TabsTrigger
            value="payments"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Payments
          </TabsTrigger>
          <TabsTrigger
            value="purchase-orders"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Purchase Orders
          </TabsTrigger>
          <TabsTrigger
            value="payment-lifecycle"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Payment Lifecycle
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bills" className="space-y-4">
          <BillsList />
        </TabsContent>

        <TabsContent value="vendors" className="space-y-4">
          <VendorsList />
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <PaymentsList />
        </TabsContent>

        <TabsContent value="payment-lifecycle" className="space-y-4">
          <PaymentLifecycle />
        </TabsContent>

        <TabsContent value="purchase-orders" className="space-y-4">
          {showNewPurchaseOrderForm ? (
            <PurchaseOrderForm
              onSubmit={(data) => {
                setPurchaseOrders([
                  ...purchaseOrders,
                  {
                    id: data.purchaseOrderNumber,
                    vendor:
                      vendors.find((v) => v.id === data.vendor)?.name ||
                      "Unknown Vendor",
                    date: new Date(data.orderDate).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }),
                    status: "Open",
                    amount: `₹${data.total.toFixed(2)}`,
                  },
                ]);
                setShowNewPurchaseOrderForm(false);
              }}
              onCancel={() => setShowNewPurchaseOrderForm(false)}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Purchase Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-2 w-full max-w-md">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search purchase orders..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" size="icon">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    className="bg-gradient-meera hover:bg-pink-700"
                    onClick={() => setShowNewPurchaseOrderForm(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" /> New Purchase Order
                  </Button>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Order #</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPurchaseOrders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4">
                            No purchase orders found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredPurchaseOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">
                              {order.id}
                            </TableCell>
                            <TableCell>{order.vendor}</TableCell>
                            <TableCell>{order.date}</TableCell>
                            <TableCell>
                              <div
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  order.status === "Open"
                                    ? "bg-blue-500/20 text-blue-700"
                                    : order.status === "Received"
                                      ? "bg-primary/20 text-primary"
                                      : "bg-gray-500/20 text-gray-700"
                                }`}
                              >
                                {order.status}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              {order.amount}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon">
                                  <FileText className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    handleDeletePurchaseOrder(order.id)
                                  }
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BillingPage;
