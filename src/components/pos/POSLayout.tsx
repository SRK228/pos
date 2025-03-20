import React, { useState, useEffect } from "react";
import ProductCatalog from "./ProductCatalog";
import ShoppingCart from "./ShoppingCart";
import { supabase } from "@/lib/supabase";
import { useTenant } from "@/contexts/TenantContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  sku?: string;
  current_stock?: number;
}

export interface CartItem extends Product {
  quantity: number;
  subtotal: number;
}

const POSLayout = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentTenant } = useTenant();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("products")
          .select("*, categories(name)")
          .order("name");

        if (error) throw error;

        if (data) {
          const formattedProducts = data.map((product) => ({
            id: product.id,
            name: product.name,
            price: product.price,
            category: product.categories?.name || "Uncategorized",
            image: product.image_url || "/products/placeholder.jpg",
            sku: product.sku,
            current_stock: product.current_stock,
          }));
          setProducts(formattedProducts);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
        // Fall back to demo products if API fails
        setProducts([
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [currentTenant]);

  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      // Check if product is already in cart
      const existingItemIndex = prevCart.findIndex(
        (item) => item.id === product.id,
      );

      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const updatedCart = [...prevCart];
        const item = updatedCart[existingItemIndex];
        item.quantity += 1;
        item.subtotal = item.price * item.quantity;
        return updatedCart;
      } else {
        // Add new item to cart
        return [
          ...prevCart,
          {
            ...product,
            quantity: 1,
            subtotal: product.price,
          },
        ];
      }
    });
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(id);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? { ...item, quantity, subtotal: item.price * quantity }
          : item,
      ),
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleCheckout = async (customerInfo: any) => {
    try {
      // Create a new order in the database
      const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
      const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
      const taxRate = 0.18; // 18% GST
      const taxAmount = subtotal * taxRate;
      const totalAmount = subtotal + taxAmount;

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          order_number: orderNumber,
          customer_id: customerInfo.customerId || null,
          status: "completed",
          subtotal,
          tax_amount: taxAmount,
          discount_amount: 0,
          total_amount: totalAmount,
          payment_method: customerInfo.paymentMethod,
          payment_status: "paid",
          delivery_method: customerInfo.deliveryMethod || "pickup",
          delivery_address: customerInfo.deliveryAddress || null,
          notes: customerInfo.notes || null,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Add order items
      const orderItems = cart.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.subtotal,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Update inventory
      for (const item of cart) {
        const { error: inventoryError } = await supabase
          .from("inventory_transactions")
          .insert({
            product_id: item.id,
            transaction_type: "sale",
            quantity: -item.quantity, // Negative for sales
            reference_id: order.id,
            reference_type: "order",
          });

        if (inventoryError) throw inventoryError;

        // Update product stock
        const { error: updateError } = await supabase
          .from("products")
          .update({
            current_stock: supabase.rpc("decrement", {
              row_id: item.id,
              amount: item.quantity,
            }),
          })
          .eq("id", item.id);

        if (updateError) throw updateError;
      }

      // Clear cart after successful checkout
      handleClearCart();

      return { success: true, orderId: order.id, orderNumber };
    } catch (err) {
      console.error("Checkout error:", err);
      return { success: false, error: err.message };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] bg-background">
      <div className="w-full md:w-1/2 h-1/2 md:h-full overflow-hidden border-r border-border">
        <ProductCatalog products={products} onProductSelect={handleAddToCart} />
      </div>
      <div className="w-full md:w-1/2 h-1/2 md:h-full overflow-hidden">
        <ShoppingCart
          items={cart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveFromCart}
          onClearCart={handleClearCart}
          onCheckout={handleCheckout}
        />
      </div>
    </div>
  );
};

export default POSLayout;
