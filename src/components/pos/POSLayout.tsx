import React, { useState } from "react";
import ProductCatalog from "./ProductCatalog";
import ShoppingCart from "./ShoppingCart";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface POSLayoutProps {
  onCheckout?: (items: CartItem[]) => void;
}

const POSLayout = ({ onCheckout = () => {} }: POSLayoutProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: "1", name: "Teddy Bear", price: 19.99, quantity: 2 },
    { id: "2", name: "Children's Book", price: 12.99, quantity: 1 },
    { id: "3", name: "Building Blocks", price: 24.99, quantity: 3 },
  ]);

  const handleProductSelect = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col">
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="flex-1 overflow-auto">
          <ProductCatalog onProductSelect={handleProductSelect} />
        </div>
        <div className="md:w-[400px] border-t md:border-t-0 md:border-l">
          <ShoppingCart
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
          />
        </div>
      </div>
    </div>
  );
};

export default POSLayout;
