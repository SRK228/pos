import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, Edit, Trash2 } from "lucide-react";

interface Variant {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
}

interface ItemGroupDetailProps {
  groupId?: string;
  groupName?: string;
  onBack?: () => void;
}

const ItemGroupDetail = ({
  groupId = "1",
  groupName = "Baby Clothing Set",
  onBack,
}: ItemGroupDetailProps) => {
  const [variants, setVariants] = useState<Variant[]>([
    {
      id: "v1",
      name: "Baby Clothing Set - Small",
      sku: "BCS-S",
      price: 499,
      stock: 15,
    },
    {
      id: "v2",
      name: "Baby Clothing Set - Medium",
      sku: "BCS-M",
      price: 599,
      stock: 10,
    },
    {
      id: "v3",
      name: "Baby Clothing Set - Large",
      sku: "BCS-L",
      price: 699,
      stock: 5,
    },
  ]);

  const [showAddVariantDialog, setShowAddVariantDialog] = useState(false);
  const [newVariant, setNewVariant] = useState<Partial<Variant>>({
    name: "",
    sku: "",
    price: 0,
    stock: 0,
  });

  const handleAddVariant = () => {
    if (!newVariant.name || !newVariant.sku) {
      alert("Name and SKU are required");
      return;
    }

    const variant: Variant = {
      id: `v${Date.now()}`,
      name: newVariant.name,
      sku: newVariant.sku,
      price: newVariant.price || 0,
      stock: newVariant.stock || 0,
    };

    setVariants([...variants, variant]);
    setNewVariant({
      name: "",
      sku: "",
      price: 0,
      stock: 0,
    });
    setShowAddVariantDialog(false);
  };

  const handleDeleteVariant = (id: string) => {
    if (confirm("Are you sure you want to delete this variant?")) {
      setVariants(variants.filter((v) => v.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <h1 className="text-xl sm:text-3xl font-bold text-primary truncate max-w-[200px] sm:max-w-none">
            {groupName}
          </h1>
        </div>
        <div className="text-sm text-muted-foreground">
          Meera Maternity & Fertility Store
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle>Variants</CardTitle>
          <Dialog
            open={showAddVariantDialog}
            onOpenChange={setShowAddVariantDialog}
          >
            <DialogTrigger asChild>
              <Button className="bg-gradient-meera hover:bg-pink-700">
                <Plus className="mr-2 h-4 w-4" /> Add Variant
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Variant</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="variant-name">Variant Name*</Label>
                  <Input
                    id="variant-name"
                    value={newVariant.name || ""}
                    onChange={(e) =>
                      setNewVariant({ ...newVariant, name: e.target.value })
                    }
                    placeholder="Enter variant name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="variant-sku">SKU*</Label>
                  <Input
                    id="variant-sku"
                    value={newVariant.sku || ""}
                    onChange={(e) =>
                      setNewVariant({ ...newVariant, sku: e.target.value })
                    }
                    placeholder="Enter SKU"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="variant-price">Price</Label>
                    <Input
                      id="variant-price"
                      type="number"
                      value={newVariant.price || 0}
                      onChange={(e) =>
                        setNewVariant({
                          ...newVariant,
                          price: Number(e.target.value),
                        })
                      }
                      placeholder="Enter price"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="variant-stock">Stock</Label>
                    <Input
                      id="variant-stock"
                      type="number"
                      value={newVariant.stock || 0}
                      onChange={(e) =>
                        setNewVariant({
                          ...newVariant,
                          stock: Number(e.target.value),
                        })
                      }
                      placeholder="Enter stock"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowAddVariantDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddVariant}>Add Variant</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {variants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No variants found. Add your first variant.
                    </TableCell>
                  </TableRow>
                ) : (
                  variants.map((variant) => (
                    <TableRow key={variant.id}>
                      <TableCell className="font-medium">
                        {variant.name}
                      </TableCell>
                      <TableCell>{variant.sku}</TableCell>
                      <TableCell className="text-right">
                        ₹{variant.price}
                      </TableCell>
                      <TableCell className="text-right">
                        {variant.stock}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteVariant(variant.id)}
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

      <Card>
        <CardHeader>
          <CardTitle>Group Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="group-name">Group Name</Label>
              <Input id="group-name" value={groupName} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="group-id">Group ID</Label>
              <Input id="group-id" value={groupId} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="variant-count">Variant Count</Label>
              <Input id="variant-count" value={variants.length} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="total-stock">Total Stock</Label>
              <Input
                id="total-stock"
                value={variants.reduce((sum, v) => sum + v.stock, 0)}
                readOnly
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ItemGroupDetail;
