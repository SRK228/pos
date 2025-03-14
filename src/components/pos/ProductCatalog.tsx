import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Search, Barcode, ShoppingBag, Plus } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
}

interface ProductCatalogProps {
  products?: Product[];
  onProductSelect?: (product: Product) => void;
}

const defaultProducts: Product[] = [
  // Toys
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
  // Clothes
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
  // Essentials
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
];

const ProductCatalog = ({
  products = defaultProducts,
  onProductSelect = () => {},
}: ProductCatalogProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [barcodeMode, setBarcodeMode] = useState(false);
  const [barcode, setBarcode] = useState("");

  const categories = ["All", "Toys", "Clothes", "Essentials"];

  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!barcodeMode) return;

      if (e.key === "Enter") {
        const product = products.find((p) => p.id === barcode);
        if (product) {
          onProductSelect(product);
          setBarcode("");
        }
      } else if (e.key.match(/^[0-9]$/)) {
        setBarcode((prev) => prev + e.key);
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [barcodeMode, barcode, products, onProductSelect]);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = () => {
    if (newCategory.trim() !== "") {
      setCustomCategories([...customCategories, newCategory.trim()]);
      setNewCategory("");
      setShowAddCategoryDialog(false);
    }
  };

  // Combine default and custom categories
  const allCategories = ["All", ...categories.slice(1), ...customCategories];

  return (
    <div className="h-full bg-white p-4 flex flex-col gap-4 border-pink-200">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant={barcodeMode ? "default" : "outline"}
          size="icon"
          onClick={() => setBarcodeMode(!barcodeMode)}
        >
          <Barcode className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Product Categories</h3>
        <Dialog
          open={showAddCategoryDialog}
          onOpenChange={setShowAddCategoryDialog}
        >
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <Plus className="h-3 w-3 mr-1" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="category-name">Category Name</Label>
                <Input
                  id="category-name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter category name"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowAddCategoryDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddCategory}>Add Category</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="All" className="flex-1">
        <TabsList className="grid w-full grid-cols-4 bg-pink-100 overflow-x-auto">
          {allCategories.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              className="data-[state=active]:bg-primary data-[state=active]:text-white whitespace-nowrap px-2 py-1.5 text-sm md:text-base"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {allCategories.map((category) => (
          <TabsContent
            key={category}
            value={category}
            className="h-[calc(100vh-260px)] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-1"
          >
            {filteredProducts
              .filter(
                (product) =>
                  category === "All" || product.category === category,
              )
              .map((product) => (
                <Card
                  key={product.id}
                  className="p-2 cursor-pointer hover:shadow-md transition-shadow flex flex-col"
                  onClick={() => onProductSelect(product)}
                >
                  <div className="aspect-square relative mb-2 bg-pink-50 flex items-center justify-center rounded-md overflow-hidden">
                    {product.category === "Toys" ? (
                      <div className="w-full h-full bg-pink-100 flex items-center justify-center">
                        <span className="text-2xl font-bold text-pink-800">
                          T
                        </span>
                      </div>
                    ) : product.category === "Clothes" ? (
                      <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                        <span className="text-2xl font-bold text-blue-800">
                          C
                        </span>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-green-100 flex items-center justify-center">
                        <span className="text-2xl font-bold text-green-800">
                          E
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="mt-auto">
                    <div className="text-sm font-medium">{product.name}</div>
                    <div className="text-sm text-muted-foreground">
                      ₹{product.price}
                    </div>
                  </div>
                </Card>
              ))}
            {category !== "All" && customCategories.includes(category) && (
              <Card className="p-2 cursor-pointer hover:shadow-md transition-shadow border-dashed border-2 flex items-center justify-center h-40">
                <Button
                  variant="ghost"
                  className="h-full w-full flex flex-col gap-2"
                >
                  <Plus className="h-6 w-6" />
                  <span>Add Product</span>
                </Button>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <div className="grid grid-cols-4 gap-2">
        {[
          { id: "1", name: "Teddy Bear", category: "Toys" },
          { id: "4", name: "Baby Onesie", category: "Clothes" },
          { id: "7", name: "Baby Wipes", category: "Essentials" },
          { id: "8", name: "Diapers Pack", category: "Essentials" },
        ].map((item) => {
          const product = products.find((p) => p.id === item.id);
          return (
            <Button
              key={item.id}
              variant="secondary"
              className="h-20 bg-pink-100 hover:bg-pink-200 border border-pink-200 p-1"
              onClick={() => product && onProductSelect(product)}
            >
              <div className="flex flex-col items-center gap-1 w-full">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  {item.category === "Toys" ? (
                    <div className="w-full h-full bg-pink-100 flex items-center justify-center">
                      <span className="text-xs font-bold text-pink-800">T</span>
                    </div>
                  ) : item.category === "Clothes" ? (
                    <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-800">C</span>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-green-100 flex items-center justify-center">
                      <span className="text-xs font-bold text-green-800">
                        E
                      </span>
                    </div>
                  )}
                </div>
                <span className="text-xs">{item.name}</span>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default ProductCatalog;
