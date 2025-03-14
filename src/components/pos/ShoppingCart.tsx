import React from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Trash2, Plus, Minus } from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ShoppingCartProps {
  items?: CartItem[];
  onUpdateQuantity?: (id: string, newQuantity: number) => void;
  onRemoveItem?: (id: string) => void;
  onClearCart?: () => void;
}

const ShoppingCart = ({
  items = [
    { id: "1", name: "Teddy Bear", price: 899, quantity: 2 },
    { id: "2", name: "Children's Book", price: 299, quantity: 1 },
    { id: "3", name: "Building Blocks", price: 1299, quantity: 3 },
  ],
  onUpdateQuantity = () => {},
  onRemoveItem = () => {},
  onClearCart = () => {},
}: ShoppingCartProps) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + tax;

  return (
    <Card className="h-full bg-white p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-pink-200">
        <h2 className="text-2xl font-semibold text-primary">Shopping Cart</h2>
        <Button
          variant="destructive"
          size="sm"
          onClick={onClearCart}
          className="flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Clear Cart
        </Button>
      </div>

      <ScrollArea className="flex-grow">
        {items.map((item) => (
          <div key={item.id} className="mb-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-md overflow-hidden">
                  {item.name.includes("Teddy") ||
                  item.name.includes("Block") ? (
                    <div className="w-full h-full bg-pink-100 flex items-center justify-center">
                      <span className="text-sm font-bold text-pink-800">T</span>
                    </div>
                  ) : item.name.includes("Onesie") ||
                    item.name.includes("Shirt") ? (
                    <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-800">C</span>
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
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500">₹{item.price}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500"
                  onClick={() => onRemoveItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Separator className="mt-4" />
          </div>
        ))}
      </ScrollArea>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>GST (18%)</span>
          <span>₹{tax}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
        <Button
          className="w-full mt-4 bg-gradient-meera hover:bg-pink-700"
          size="lg"
          disabled={items.length === 0}
          onClick={() => {
            alert(`Payment processed successfully!\nTotal: ₹${total}`);
            onClearCart();
          }}
        >
          Proceed to Checkout (₹{total})
        </Button>
      </div>
    </Card>
  );
};

export default ShoppingCart;
