import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const POSPreferences = () => {
  const [enableSessions, setEnableSessions] = useState(false);
  const [fetchWeight, setFetchWeight] = useState(false);
  const [enterQuantity, setEnterQuantity] = useState(false);
  const [groupItems, setGroupItems] = useState(true);
  const [enableBarcode, setEnableBarcode] = useState(false);
  const [mandateCustomer, setMandateCustomer] = useState(false);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [maxDiscount, setMaxDiscount] = useState<string>("100.0");
  const [hideOutOfStock, setHideOutOfStock] = useState(false);

  const handleSave = () => {
    alert("POS preferences saved successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">POS Preferences</h1>
        <div className="text-sm text-muted-foreground">
          Meera Maternity & Fertility Store
        </div>
      </div>

      <Tabs defaultValue="sessions" className="space-y-4">
        <TabsList className="bg-muted overflow-x-auto flex whitespace-nowrap">
          <TabsTrigger
            value="sessions"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Sessions
          </TabsTrigger>
          <TabsTrigger
            value="sales"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Sales
          </TabsTrigger>
          <TabsTrigger
            value="customer"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Customer
          </TabsTrigger>
          <TabsTrigger
            value="others"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Others
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="enable-sessions"
                    checked={enableSessions}
                    onCheckedChange={(checked) =>
                      setEnableSessions(checked as boolean)
                    }
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="enable-sessions"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Enable sessions & cash tracking
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="min-price">
                      Item price should not be less than
                    </Label>
                    <div className="relative">
                      <Select defaultValue="no-restrictions">
                        <SelectTrigger>
                          <SelectValue placeholder="No restrictions" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no-restrictions">
                            No restrictions
                          </SelectItem>
                          <SelectItem value="cost-price">Cost Price</SelectItem>
                          <SelectItem value="custom">Custom Value</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-price">
                      Item price should not be more than
                    </Label>
                    <div className="relative">
                      <Select defaultValue="no-restrictions">
                        <SelectTrigger>
                          <SelectValue placeholder="No restrictions" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no-restrictions">
                            No restrictions
                          </SelectItem>
                          <SelectItem value="selling-price">
                            Selling Price
                          </SelectItem>
                          <SelectItem value="custom">Custom Value</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-discount">
                    Maximum bill discount allowed
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="max-discount"
                      type="number"
                      value={maxDiscount}
                      onChange={(e) => setMaxDiscount(e.target.value)}
                      className="w-full"
                    />
                    <span className="text-lg">%</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="fetch-weight"
                      checked={fetchWeight}
                      onCheckedChange={(checked) =>
                        setFetchWeight(checked as boolean)
                      }
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="fetch-weight"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Fetch item quantity from the connected weight scale
                      </Label>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="enter-quantity"
                      checked={enterQuantity}
                      onCheckedChange={(checked) =>
                        setEnterQuantity(checked as boolean)
                      }
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="enter-quantity"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Enter item quantity before adding item to the cart
                      </Label>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="group-items"
                      checked={groupItems}
                      onCheckedChange={(checked) =>
                        setGroupItems(checked as boolean)
                      }
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="group-items"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Group the items added more than once as a single line
                        item
                      </Label>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="enable-barcode"
                      checked={enableBarcode}
                      onCheckedChange={(checked) =>
                        setEnableBarcode(checked as boolean)
                      }
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="enable-barcode"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Enable embedded barcode.
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="mandate-customer"
                    checked={mandateCustomer}
                    onCheckedChange={(checked) =>
                      setMandateCustomer(checked as boolean)
                    }
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="mandate-customer"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Mandate customer mapping for an invoice
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="others" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Others</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="hide-out-of-stock"
                    checked={hideOutOfStock}
                    onCheckedChange={(checked) =>
                      setHideOutOfStock(checked as boolean)
                    }
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="hide-out-of-stock"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Hide out of stock items
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button
          className="bg-gradient-meera hover:bg-pink-700"
          onClick={handleSave}
        >
          Save Preferences
        </Button>
      </div>
    </div>
  );
};

export default POSPreferences;
