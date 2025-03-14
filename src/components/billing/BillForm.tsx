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
import { Plus, Trash2, Upload, Info } from "lucide-react";

interface BillFormProps {
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

const BillForm = ({
  onSubmit = () => {},
  onCancel = () => {},
}: BillFormProps) => {
  const [billItems, setBillItems] = useState<any[]>([
    { id: 1, description: "", account: "", quantity: 1, rate: 0, amount: 0 },
  ]);

  const addItem = () => {
    setBillItems([
      ...billItems,
      {
        id: billItems.length + 1,
        description: "",
        account: "",
        quantity: 1,
        rate: 0,
        amount: 0,
      },
    ]);
  };

  const removeItem = (id: number) => {
    setBillItems(billItems.filter((item) => item.id !== id));
  };

  const updateItem = (id: number, field: string, value: any) => {
    setBillItems(
      billItems.map((item) => {
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
    return billItems.reduce((sum, item) => sum + (item.amount || 0), 0);
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + tax;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>New Bill</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="vendor" className="text-primary">
                Vendor Name*
              </Label>
              <Select>
                <SelectTrigger id="vendor">
                  <SelectValue placeholder="Select a vendor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vendor1">Kids Toys Inc.</SelectItem>
                  <SelectItem value="vendor2">Baby Essentials Ltd.</SelectItem>
                  <SelectItem value="vendor3">Kids Clothing Co.</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bill-number" className="text-primary">
                Bill#*
              </Label>
              <Input id="bill-number" placeholder="Enter bill number" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="order-number">Order Number</Label>
              <Input id="order-number" placeholder="Enter order number" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bill-date" className="text-primary">
                Bill Date*
              </Label>
              <Input id="bill-date" type="date" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="due-date">Due Date</Label>
              <Input id="due-date" type="date" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment-terms">Payment Terms</Label>
              <Select>
                <SelectTrigger id="payment-terms">
                  <SelectValue placeholder="Select payment terms" />
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Enter a subject within 250 characters"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Item Table</h3>
              <Button variant="outline" size="sm">
                Bulk Actions
              </Button>
            </div>

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
                  {billItems.map((item) => (
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
                          disabled={billItems.length === 1}
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
              <Plus className="mr-2 h-4 w-4" /> Add New Row
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
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Enter notes (will not be shown in PDF)"
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Attach File(s) to Bill</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <Button variant="outline" className="mx-auto">
                <Upload className="mr-2 h-4 w-4" /> Upload File
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                You can upload a maximum of 5 files, 10MB each
              </p>
            </div>
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <Info className="h-4 w-4 mr-2" />
            <span>
              Additional Fields: Start adding custom fields for your payments by
              going to Settings → Purchases → Bills
            </span>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="outline">Save as Draft</Button>
            <Button
              className="bg-gradient-meera hover:bg-pink-700"
              onClick={() => onSubmit({ items: billItems, total })}
            >
              Save as Open
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillForm;
