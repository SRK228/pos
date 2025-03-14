import React, { useState, useEffect } from "react";
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

interface OrderFormProps {
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

const OrderForm = ({
  onSubmit = () => {},
  onCancel = () => {},
}: OrderFormProps) => {
  // Add a small delay to ensure component is fully loaded
  React.useEffect(() => {
    console.log("OrderForm component mounted");
    // Log any URL or routing issues
    console.log("Current URL:", window.location.href);
    console.log("Current pathname:", window.location.pathname);
  }, []);
  const [orderItems, setOrderItems] = useState<any[]>([
    { id: 1, description: "", category: "", quantity: 1, rate: 0, amount: 0 },
  ]);

  const [deliveryType, setDeliveryType] = useState("pickup");

  // Sample product data - in a real app, this would come from an API or database
  const [products, setProducts] = useState([
    {
      id: "1",
      name: "Soft Teddy Bear",
      price: 899,
      category: "Toys",
      image: "/products/teddy-bear.jpg",
    },
    {
      id: "2",
      name: "Building Blocks",
      price: 1299,
      category: "Toys",
      image: "/products/building-blocks.jpg",
    },
    {
      id: "3",
      name: "Art Set",
      price: 599,
      category: "Toys",
      image: "/products/art-set.jpg",
    },
    {
      id: "4",
      name: "Baby Onesie",
      price: 499,
      category: "Clothes",
      image: "/products/baby-onesie.jpg",
    },
    {
      id: "5",
      name: "Kids T-Shirt",
      price: 399,
      category: "Clothes",
      image: "/products/kids-tshirt.jpg",
    },
    {
      id: "6",
      name: "Baby Shoes",
      price: 699,
      category: "Clothes",
      image: "/products/baby-shoes.jpg",
    },
    {
      id: "7",
      name: "Baby Wipes",
      price: 199,
      category: "Essentials",
      image: "/products/baby-wipes.jpg",
    },
    {
      id: "8",
      name: "Diapers Pack",
      price: 899,
      category: "Essentials",
      image: "/products/diapers.jpg",
    },
    {
      id: "9",
      name: "Baby Lotion",
      price: 299,
      category: "Essentials",
      image: "/products/baby-lotion.jpg",
    },
  ]);

  const addItem = () => {
    setOrderItems([
      ...orderItems,
      {
        id: orderItems.length + 1,
        description: "",
        category: "",
        quantity: 1,
        rate: 0,
        amount: 0,
      },
    ]);
  };

  // Function to handle barcode scanning
  useEffect(() => {
    const handleBarcodeInput = (event: KeyboardEvent) => {
      // Check if we're in barcode scanning mode
      if (event.key === "Enter") {
        const barcodeInput = (event.target as HTMLInputElement)?.value;
        if (barcodeInput) {
          // Find product by barcode (using ID as mock barcode in this example)
          const product = products.find((p) => p.id === barcodeInput);
          if (product) {
            // Add product to order items
            setOrderItems((prevItems) => [
              ...prevItems,
              {
                id: prevItems.length + 1,
                description: product.id,
                category: product.category,
                quantity: 1,
                rate: product.price,
                amount: product.price,
              },
            ]);
            // Clear the input field
            if (event.target instanceof HTMLInputElement) {
              event.target.value = "";
            }
          }
        }
      }
    };

    // Set up barcode scanning button
    const handleScanBarcode = () => {
      const barcodeInput = prompt("Scan or enter barcode:");
      if (barcodeInput) {
        const product = products.find((p) => p.id === barcodeInput);
        if (product) {
          setOrderItems((prevItems) => [
            ...prevItems,
            {
              id: prevItems.length + 1,
              description: product.id,
              category: product.category,
              quantity: 1,
              rate: product.price,
              amount: product.price,
            },
          ]);
        } else {
          alert("Product not found!");
        }
      }
    };

    // Add event listener directly to the button
    const scanButton = document.getElementById("scan-barcode-btn");
    if (scanButton) {
      // Remove any existing listeners to prevent duplicates
      scanButton.replaceWith(scanButton.cloneNode(true));
      // Get the fresh reference after replacement
      const newScanButton = document.getElementById("scan-barcode-btn");
      if (newScanButton) {
        newScanButton.addEventListener("click", handleScanBarcode);
      }
    }

    // Add event listener for barcode scanner input
    document.addEventListener("keypress", handleBarcodeInput);

    return () => {
      document.removeEventListener("keypress", handleBarcodeInput);
      const scanBtn = document.getElementById("scan-barcode-btn");
      if (scanBtn) {
        scanBtn.removeEventListener("click", handleScanBarcode);
      }
    };
  }, [products, orderItems]);

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

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + tax;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>New Sales Order</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="customer" className="text-primary">
                Customer Name*
              </Label>
              <Input id="customer" placeholder="Enter customer name" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-primary">
                Phone Number*
              </Label>
              <Input id="phone" placeholder="Enter phone number" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="order-number" className="text-primary">
                Order #*
              </Label>
              <Input id="order-number" placeholder="ORD-00001" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="text-primary">
                Order Date*
              </Label>
              <Input
                id="date"
                type="date"
                value={new Date().toISOString().split("T")[0]}
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="delivery-method" className="text-primary">
                Delivery Method*
              </Label>
              <RadioGroup
                defaultValue={deliveryType}
                onValueChange={setDeliveryType}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pickup" id="pickup" />
                  <Label htmlFor="pickup">Store Pickup</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="delivery" id="delivery" />
                  <Label htmlFor="delivery">Home Delivery</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {deliveryType === "delivery" && (
            <div className="space-y-4 border rounded-lg p-4 bg-muted/20">
              <h3 className="font-medium">Delivery Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Address Line 1</Label>
                  <Input placeholder="Enter address line 1" />
                </div>
                <div className="space-y-2">
                  <Label>Address Line 2</Label>
                  <Input placeholder="Enter address line 2" />
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input placeholder="Enter city" />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input placeholder="Enter state" />
                </div>
                <div className="space-y-2">
                  <Label>Postal Code</Label>
                  <Input placeholder="Enter postal code" />
                </div>
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Select defaultValue="india">
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="india">India</SelectItem>
                      <SelectItem value="usa">United States</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Order Items</h3>
              <Button variant="outline" size="sm" id="scan-barcode-btn">
                Scan Barcode
              </Button>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Scan</TableHead>
                    <TableHead className="w-[400px]">Item</TableHead>
                    <TableHead className="w-[100px]">Quantity</TableHead>
                    <TableHead className="w-[100px]">Price</TableHead>
                    <TableHead className="w-[100px]">Amount</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="w-[50px]">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const barcodeInput = prompt(
                              "Scan or enter barcode:",
                            );
                            if (barcodeInput) {
                              const product = products.find(
                                (p) => p.id === barcodeInput,
                              );
                              if (product) {
                                const updatedItem = {
                                  ...item,
                                  description: product.id,
                                  category: product.category,
                                  rate: product.price,
                                  amount: product.price * item.quantity,
                                };
                                setOrderItems(
                                  orderItems.map((i) =>
                                    i.id === item.id ? updatedItem : i,
                                  ),
                                );
                              } else {
                                alert("Product not found!");
                              }
                            }
                          }}
                        >
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
                          >
                            <path d="M3 5v14" />
                            <path d="M8 5v14" />
                            <path d="M12 5v14" />
                            <path d="M17 5v14" />
                            <path d="M21 5v14" />
                          </svg>
                        </Button>
                      </TableCell>
                      <TableCell className="w-[400px]">
                        <Select
                          value={item.description}
                          onValueChange={(value) => {
                            // Find the product details based on selected value
                            const selectedProduct = products.find(
                              (p) => p.id === value,
                            );
                            if (selectedProduct) {
                              // Create a new item with all updated fields
                              const updatedItem = {
                                ...item,
                                description: value,
                                category: selectedProduct.category,
                                rate: selectedProduct.price,
                                amount: selectedProduct.price * item.quantity,
                              };

                              // Replace the item in the orderItems array
                              setOrderItems(
                                orderItems.map((i) =>
                                  i.id === item.id ? updatedItem : i,
                                ),
                              );
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select an item">
                              {item.description
                                ? products.find(
                                    (p) => p.id === item.description,
                                  )?.name
                                : "Select an item"}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name}
                              </SelectItem>
                            ))}
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

            <Button variant="outline" onClick={addItem}>
              <Plus className="mr-2 h-4 w-4" /> Add Item
            </Button>

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
                  <span>GST (18%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <Input type="number" className="w-[100px]" defaultValue="0" />
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-method">Payment Method</Label>
            <Select defaultValue="cash">
              <SelectTrigger id="payment-method">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Credit/Debit Card</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Order Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any special instructions or notes"
              className="min-h-[100px]"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="outline">Save as Draft</Button>
            <Button
              className="bg-gradient-meera hover:bg-pink-700"
              onClick={() => {
                // Validate form before submission
                const customerName = (
                  document.getElementById("customer") as HTMLInputElement
                )?.value;
                const phoneNumber = (
                  document.getElementById("phone") as HTMLInputElement
                )?.value;
                const orderNumber = (
                  document.getElementById("order-number") as HTMLInputElement
                )?.value;
                const orderDate = new Date().toISOString().split("T")[0];

                // Check if required fields are filled
                const errors = [];
                if (!customerName) errors.push("Customer name is required");
                if (!phoneNumber) errors.push("Phone number is required");
                if (!orderNumber) errors.push("Order number is required");
                // Order date is always set to today
                if (orderItems.some((item) => !item.description))
                  errors.push("All items must have a product selected");
                if (orderItems.some((item) => item.quantity <= 0))
                  errors.push("All items must have a quantity greater than 0");

                if (errors.length > 0) {
                  alert(
                    "Please fix the following errors:\n" + errors.join("\n"),
                  );
                  return;
                }

                onSubmit({
                  customer: customerName,
                  phone: phoneNumber,
                  orderNumber: orderNumber,
                  orderDate: orderDate,
                  items: orderItems,
                  total: total,
                });
                alert("Order created successfully!");
              }}
            >
              Create Order
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderForm;
