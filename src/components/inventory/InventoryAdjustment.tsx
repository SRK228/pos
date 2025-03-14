import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Upload, Trash2 } from "lucide-react";

interface AdjustmentItem {
  id: string;
  name: string;
  currentQuantity: number;
  newQuantity: number;
  adjustment: number;
}

const InventoryAdjustment = () => {
  const [adjustmentType, setAdjustmentType] = useState("quantity");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [account, setAccount] = useState("cost-of-goods-sold");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [items, setItems] = useState<AdjustmentItem[]>([]);

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: `item-${Date.now()}`,
        name: "",
        currentQuantity: 0,
        newQuantity: 0,
        adjustment: 0,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleItemChange = (id: string, field: string, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          // Recalculate adjustment if newQuantity changes
          if (field === "newQuantity") {
            updatedItem.adjustment = value - item.currentQuantity;
          }

          return updatedItem;
        }
        return item;
      }),
    );
  };

  const handleSubmit = () => {
    // Validate form
    if (!date) {
      alert("Date is required");
      return;
    }
    if (!account) {
      alert("Account is required");
      return;
    }
    if (!reason) {
      alert("Reason is required");
      return;
    }
    if (items.length === 0) {
      alert("Please add at least one item");
      return;
    }

    // Submit form
    alert("Inventory adjustment saved successfully!");
    console.log({
      adjustmentType,
      referenceNumber,
      date,
      account,
      reason,
      description,
      items,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">
          New Adjustment
        </h1>
        <div className="text-sm text-muted-foreground">
          Meera Maternity & Fertility Store
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Adjustment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Mode of adjustment</Label>
              <RadioGroup
                value={adjustmentType}
                onValueChange={setAdjustmentType}
                className="flex flex-col sm:flex-row gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="quantity" id="quantity" />
                  <Label htmlFor="quantity">Quantity Adjustment</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="value" id="value" />
                  <Label htmlFor="value">Value Adjustment</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="reference">Reference Number</Label>
                <Input
                  id="reference"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder="Enter reference number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="text-primary">
                  Date*
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="account" className="text-primary">
                  Account*
                </Label>
                <Select value={account} onValueChange={setAccount}>
                  <SelectTrigger id="account">
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cost-of-goods-sold">
                      Cost of Goods Sold
                    </SelectItem>
                    <SelectItem value="inventory-asset">
                      Inventory Asset
                    </SelectItem>
                    <SelectItem value="purchase-returns">
                      Purchase Returns
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason" className="text-primary">
                  Reason*
                </Label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger id="reason">
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="damaged">Damaged Goods</SelectItem>
                    <SelectItem value="expired">Expired Items</SelectItem>
                    <SelectItem value="theft">Theft or Loss</SelectItem>
                    <SelectItem value="count">
                      Physical Count Adjustment
                    </SelectItem>
                    <SelectItem value="return">Customer Return</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Max. 500 characters"
                className="min-h-[100px]"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h3 className="font-medium">ITEM DETAILS</h3>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={handleAddItem}>
                  <Plus className="h-4 w-4 mr-1" /> Add New Row
                </Button>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" /> Add Items in Bulk
                </Button>
              </div>
            </div>

            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ITEM DETAILS</TableHead>
                    <TableHead className="w-[150px]">
                      QUANTITY AVAILABLE
                    </TableHead>
                    <TableHead className="w-[150px]">
                      NEW QUANTITY ON HAND
                    </TableHead>
                    <TableHead className="w-[150px]">
                      QUANTITY ADJUSTED
                    </TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-muted-foreground">
                            Type or click to select an item.
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Select
                            value={item.name || undefined}
                            onValueChange={(value) =>
                              handleItemChange(item.id, "name", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Type or click to select an item" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="teddy-bear">
                                Soft Teddy Bear
                              </SelectItem>
                              <SelectItem value="baby-onesie">
                                Baby Onesie
                              </SelectItem>
                              <SelectItem value="diapers">
                                Diapers Pack
                              </SelectItem>
                              <SelectItem value="baby-wipes">
                                Baby Wipes
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.currentQuantity}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "currentQuantity",
                                Number(e.target.value),
                              )
                            }
                            readOnly
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.newQuantity}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "newQuantity",
                                Number(e.target.value),
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              Eg. +10, -10
                            </span>
                            <Input
                              type="text"
                              value={
                                item.adjustment > 0
                                  ? `+${item.adjustment}`
                                  : item.adjustment
                              }
                              readOnly
                              className="w-full sm:w-auto"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Attach File(s) to inventory adjustment</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Button variant="outline" className="mx-auto">
                  <Upload className="mr-2 h-4 w-4" /> Upload File
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  You can upload a maximum of 5 files, 10MB each
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
            <Button variant="outline" className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button
              className="bg-gradient-meera hover:bg-pink-700 w-full sm:w-auto"
              onClick={handleSubmit}
            >
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryAdjustment;
