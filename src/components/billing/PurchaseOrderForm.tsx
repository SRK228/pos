import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Trash2, Upload, Info } from "lucide-react";

interface PurchaseOrderFormProps {
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

const PurchaseOrderForm = ({
  onSubmit = () => {},
  onCancel = () => {},
}: PurchaseOrderFormProps) => {
  const [orderItems, setOrderItems] = useState<any[]>([
    { id: 1, description: "", account: "", quantity: 1, rate: 0, amount: 0 },
  ]);

  const [deliveryType, setDeliveryType] = useState("organization");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [vendors, setVendors] = useState([
    { id: "vendor1", name: "Kids Toys Inc." },
    { id: "vendor2", name: "Baby Essentials Ltd." },
    { id: "vendor3", name: "Kids Clothing Co." },
  ]);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [purchaseOrderNumber, setPurchaseOrderNumber] = useState(
    "PO-" +
      Math.floor(Math.random() * 10000)
        .toString()
        .padStart(5, "0"),
  );
  const [referenceNumber, setReferenceNumber] = useState("");
  const [orderDate, setOrderDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [deliveryDate, setDeliveryDate] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("due-on-receipt");
  const [shipmentPreference, setShipmentPreference] = useState("standard");

  const addItem = () => {
    setOrderItems([
      ...orderItems,
      {
        id: orderItems.length + 1,
        description: "",
        account: "",
        quantity: 1,
        rate: 0,
        amount: 0,
      },
    ]);
  };

  const removeItem = (id: number) => {
    setOrderItems(orderItems.filter((item) => item.id !== id));
  };

  const updateItem = (id: number, field: string, value: any) => {
    setOrderItems(
      orderItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          // Recalculate amount if quantity or rate changes
          if (field === "quantity" || field === "rate") {
            updatedItem.amount = updatedItem.quantity * updatedItem.rate;
          }

          return updatedItem;
        }
        return item;
      }),
    );
  };

  const calculateSubtotal = () => {
    return orderItems.reduce((sum, item) => sum + (item.amount || 0), 0);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!selectedVendor) {
      errors.vendor = "Vendor is required";
    }

    if (!purchaseOrderNumber) {
      errors.purchaseOrder = "Purchase Order number is required";
    }

    if (!orderDate) {
      errors.date = "Date is required";
    }

    if (orderItems.some((item) => !item.description)) {
      errors.items = "All items must have a description";
    }

    if (orderItems.some((item) => item.quantity <= 0)) {
      errors.quantity = "All items must have a quantity greater than 0";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + tax;

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        vendor: selectedVendor,
        purchaseOrderNumber,
        referenceNumber,
        orderDate,
        deliveryDate,
        paymentTerms,
        shipmentPreference,
        deliveryType,
        items: orderItems,
        subtotal,
        tax,
        total,
      });
      alert("Purchase order created successfully!");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>New Purchase Order</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="vendor" className="text-primary">
                Vendor Name*
              </Label>
              <Select value={selectedVendor} onValueChange={setSelectedVendor}>
                <SelectTrigger id="vendor">
                  <SelectValue placeholder="Select a vendor" />
                </SelectTrigger>
                <SelectContent>
                  {vendors.map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.vendor && (
                <p className="text-sm text-red-500">{formErrors.vendor}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="delivery-address" className="text-primary">
                Delivery Address*
              </Label>
              <RadioGroup
                defaultValue={deliveryType}
                onValueChange={setDeliveryType}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="organization" id="organization" />
                  <Label htmlFor="organization">Organization</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="customer" id="customer" />
                  <Label htmlFor="customer">Customer</Label>
                </div>
              </RadioGroup>
              {deliveryType === "organization" && (
                <div className="border rounded-lg p-3 bg-gray-50">
                  <p className="font-medium">RAMESH KUMAR SWAMINATHAN</p>
                  <p className="text-sm text-gray-600">Tamil Nadu</p>
                  <p className="text-sm text-gray-600">India</p>
                  <p className="text-sm text-gray-600">9578021228</p>
                  <Button variant="link" className="text-xs p-0 h-auto mt-1">
                    Change destination to deliver
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchase-order" className="text-primary">
                Purchase Order#*
              </Label>
              <Input
                id="purchase-order"
                value={purchaseOrderNumber}
                onChange={(e) => setPurchaseOrderNumber(e.target.value)}
              />
              {formErrors.purchaseOrder && (
                <p className="text-sm text-red-500">
                  {formErrors.purchaseOrder}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference">Reference#</Label>
              <Input
                id="reference"
                placeholder="Enter reference number"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date*</Label>
              <Input
                id="date"
                type="date"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
              />
              {formErrors.date && (
                <p className="text-sm text-red-500">{formErrors.date}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="delivery-date">Delivery Date</Label>
              <Input
                id="delivery-date"
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment-terms">Payment Terms</Label>
              <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                <SelectTrigger id="payment-terms">
                  <SelectValue placeholder="Due On Receipt" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="due-on-receipt">Due on Receipt</SelectItem>
                  <SelectItem value="net-15">Net 15</SelectItem>
                  <SelectItem value="net-30">Net 30</SelectItem>
                  <SelectItem value="net-45">Net 45</SelectItem>
                  <SelectItem value="net-60">Net 60</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shipment-preference">Shipment Preference</Label>
              <Select
                value={shipmentPreference}
                onValueChange={setShipmentPreference}
              >
                <SelectTrigger id="shipment-preference">
                  <SelectValue placeholder="Choose the shipment preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Shipping</SelectItem>
                  <SelectItem value="express">Express Shipping</SelectItem>
                  <SelectItem value="overnight">Overnight Shipping</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Item Table</h3>
              <Button variant="outline" size="sm">
                Bulk Actions
              </Button>
            </div>

            {formErrors.items && (
              <p className="text-sm text-red-500">{formErrors.items}</p>
            )}
            {formErrors.quantity && (
              <p className="text-sm text-red-500">{formErrors.quantity}</p>
            )}

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Item Details</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead className="w-[100px]">Quantity</TableHead>
                    <TableHead className="w-[100px]">Rate</TableHead>
                    <TableHead className="w-[100px]">Amount</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Input
                          placeholder="Type or click to select an item"
                          value={item.description}
                          onChange={(e) =>
                            updateItem(item.id, "description", e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={item.account}
                          onValueChange={(value) =>
                            updateItem(item.id, "account", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select an account" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="inventory">
                              Inventory Asset
                            </SelectItem>
                            <SelectItem value="expense">Expense</SelectItem>
                            <SelectItem value="cogs">
                              Cost of Goods Sold
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              "quantity",
                              Number(e.target.value),
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.rate}
                          onChange={(e) =>
                            updateItem(item.id, "rate", Number(e.target.value))
                          }
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        ₹{item.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          disabled={orderItems.length === 1}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={addItem}>
                <Plus className="mr-2 h-4 w-4" /> Add New Row
              </Button>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" /> Add Items in Bulk
              </Button>
            </div>

            <div className="flex justify-end">
              <div className="w-[300px] space-y-2">
                <div className="flex justify-between">
                  <span>Sub Total</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount</span>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      className="w-16 text-right"
                      defaultValue="0"
                    />
                    <span>%</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>TDS</span>
                  <Select defaultValue="none">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a tax" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Select a Tax</SelectItem>
                      <SelectItem value="gst18">GST 18%</SelectItem>
                      <SelectItem value="gst12">GST 12%</SelectItem>
                      <SelectItem value="gst5">GST 5%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-between">
                  <span>Adjustment</span>
                  <Input type="number" className="w-[180px]" defaultValue="0" />
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total ( Rs. )</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer-notes">Customer Notes</Label>
            <Textarea
              id="customer-notes"
              placeholder="Will be displayed on purchase order"
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="terms">Terms & Conditions</Label>
            <Textarea
              id="terms"
              placeholder="Enter the terms and conditions of your business to be displayed in your transaction"
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Attach File(s) to Purchase Order</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <Button variant="outline" className="mx-auto">
                <Upload className="mr-2 h-4 w-4" /> Upload File
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                You can upload a maximum of 10 files, 10MB each
              </p>
            </div>
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <Info className="h-4 w-4 mr-2" />
            <span>
              Additional Fields: Start adding custom fields for your purchase
              orders by going to Settings → Purchases → Purchase orders
            </span>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="outline">Save as Draft</Button>
            <Button
              className="bg-gradient-meera hover:bg-pink-700"
              onClick={handleSubmit}
            >
              Save and Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PurchaseOrderForm;
