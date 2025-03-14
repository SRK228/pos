export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          password: string;
          full_name: string;
          role: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          password: string;
          full_name: string;
          role: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          password?: string;
          full_name?: string;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          sku: string;
          name: string;
          description: string | null;
          category_id: string | null;
          price: number;
          cost_price: number;
          current_stock: number;
          reorder_level: number;
          image_url: string | null;
          barcode: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          sku: string;
          name: string;
          description?: string | null;
          category_id?: string | null;
          price: number;
          cost_price: number;
          current_stock?: number;
          reorder_level?: number;
          image_url?: string | null;
          barcode?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          sku?: string;
          name?: string;
          description?: string | null;
          category_id?: string | null;
          price?: number;
          cost_price?: number;
          current_stock?: number;
          reorder_level?: number;
          image_url?: string | null;
          barcode?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      customers: {
        Row: {
          id: string;
          name: string;
          email: string | null;
          phone: string | null;
          address: string | null;
          city: string | null;
          state: string | null;
          postal_code: string | null;
          country: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          postal_code?: string | null;
          country?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          postal_code?: string | null;
          country?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      vendors: {
        Row: {
          id: string;
          name: string;
          company: string | null;
          email: string | null;
          phone: string | null;
          mobile: string | null;
          address: string | null;
          city: string | null;
          state: string | null;
          postal_code: string | null;
          country: string;
          pan: string | null;
          is_msme: boolean;
          currency: string;
          payment_terms: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          company?: string | null;
          email?: string | null;
          phone?: string | null;
          mobile?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          postal_code?: string | null;
          country?: string;
          pan?: string | null;
          is_msme?: boolean;
          currency?: string;
          payment_terms?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          company?: string | null;
          email?: string | null;
          phone?: string | null;
          mobile?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          postal_code?: string | null;
          country?: string;
          pan?: string | null;
          is_msme?: boolean;
          currency?: string;
          payment_terms?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          customer_id: string | null;
          user_id: string | null;
          order_date: string;
          status: string;
          subtotal: number;
          tax_amount: number;
          discount_amount: number;
          total_amount: number;
          payment_method: string;
          payment_status: string;
          delivery_method: string | null;
          delivery_address: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          customer_id?: string | null;
          user_id?: string | null;
          order_date?: string;
          status: string;
          subtotal: number;
          tax_amount: number;
          discount_amount?: number;
          total_amount: number;
          payment_method: string;
          payment_status: string;
          delivery_method?: string | null;
          delivery_address?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          customer_id?: string | null;
          user_id?: string | null;
          order_date?: string;
          status?: string;
          subtotal?: number;
          tax_amount?: number;
          discount_amount?: number;
          total_amount?: number;
          payment_method?: string;
          payment_status?: string;
          delivery_method?: string | null;
          delivery_address?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          quantity?: number;
          unit_price?: number;
          total_price?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      inventory_transactions: {
        Row: {
          id: string;
          product_id: string | null;
          transaction_type: string;
          quantity: number;
          reference_id: string | null;
          reference_type: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id?: string | null;
          transaction_type: string;
          quantity: number;
          reference_id?: string | null;
          reference_type?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string | null;
          transaction_type?: string;
          quantity?: number;
          reference_id?: string | null;
          reference_type?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      purchase_orders: {
        Row: {
          id: string;
          po_number: string;
          vendor_id: string | null;
          user_id: string | null;
          order_date: string;
          expected_delivery_date: string | null;
          status: string;
          subtotal: number;
          tax_amount: number;
          discount_amount: number;
          total_amount: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          po_number: string;
          vendor_id?: string | null;
          user_id?: string | null;
          order_date?: string;
          expected_delivery_date?: string | null;
          status: string;
          subtotal: number;
          tax_amount: number;
          discount_amount?: number;
          total_amount: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          po_number?: string;
          vendor_id?: string | null;
          user_id?: string | null;
          order_date?: string;
          expected_delivery_date?: string | null;
          status?: string;
          subtotal?: number;
          tax_amount?: number;
          discount_amount?: number;
          total_amount?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      purchase_order_items: {
        Row: {
          id: string;
          purchase_order_id: string;
          product_id: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          purchase_order_id: string;
          product_id?: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          purchase_order_id?: string;
          product_id?: string | null;
          quantity?: number;
          unit_price?: number;
          total_price?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      bills: {
        Row: {
          id: string;
          bill_number: string;
          vendor_id: string | null;
          purchase_order_id: string | null;
          bill_date: string;
          due_date: string | null;
          status: string;
          subtotal: number;
          tax_amount: number;
          discount_amount: number;
          total_amount: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          bill_number: string;
          vendor_id?: string | null;
          purchase_order_id?: string | null;
          bill_date?: string;
          due_date?: string | null;
          status: string;
          subtotal: number;
          tax_amount: number;
          discount_amount?: number;
          total_amount: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          bill_number?: string;
          vendor_id?: string | null;
          purchase_order_id?: string | null;
          bill_date?: string;
          due_date?: string | null;
          status?: string;
          subtotal?: number;
          tax_amount?: number;
          discount_amount?: number;
          total_amount?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      bill_items: {
        Row: {
          id: string;
          bill_id: string;
          product_id: string | null;
          account: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          bill_id: string;
          product_id?: string | null;
          account: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          bill_id?: string;
          product_id?: string | null;
          account?: string;
          quantity?: number;
          unit_price?: number;
          total_price?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          payment_number: string;
          vendor_id: string | null;
          bill_id: string | null;
          payment_date: string;
          amount: number;
          payment_mode: string;
          reference: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          payment_number: string;
          vendor_id?: string | null;
          bill_id?: string | null;
          payment_date?: string;
          amount: number;
          payment_mode: string;
          reference?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          payment_number?: string;
          vendor_id?: string | null;
          bill_id?: string | null;
          payment_date?: string;
          amount?: number;
          payment_mode?: string;
          reference?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      reports: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          module: string;
          fields: Json;
          filters: Json | null;
          sorting: Json | null;
          is_custom: boolean;
          is_favorite: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          module: string;
          fields: Json;
          filters?: Json | null;
          sorting?: Json | null;
          is_custom?: boolean;
          is_favorite?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          module?: string;
          fields?: Json;
          filters?: Json | null;
          sorting?: Json | null;
          is_custom?: boolean;
          is_favorite?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      scheduled_reports: {
        Row: {
          id: string;
          report_id: string;
          frequency: string;
          day_of_week: number | null;
          day_of_month: number | null;
          time_of_day: string | null;
          recipients: Json | null;
          format: string;
          is_active: boolean;
          last_run: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          report_id: string;
          frequency: string;
          day_of_week?: number | null;
          day_of_month?: number | null;
          time_of_day?: string | null;
          recipients?: Json | null;
          format: string;
          is_active?: boolean;
          last_run?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          report_id?: string;
          frequency?: string;
          day_of_week?: number | null;
          day_of_month?: number | null;
          time_of_day?: string | null;
          recipients?: Json | null;
          format?: string;
          is_active?: boolean;
          last_run?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      report_history: {
        Row: {
          id: string;
          report_id: string;
          user_id: string | null;
          parameters: Json | null;
          file_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          report_id: string;
          user_id?: string | null;
          parameters?: Json | null;
          file_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          report_id?: string;
          user_id?: string | null;
          parameters?: Json | null;
          file_url?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      sales_by_product: {
        Row: {
          product_id: string | null;
          product_name: string | null;
          sku: string | null;
          category_name: string | null;
          total_quantity_sold: number | null;
          total_revenue: number | null;
          order_count: number | null;
        };
      };
      sales_by_category: {
        Row: {
          category_id: string | null;
          category_name: string | null;
          total_quantity_sold: number | null;
          total_revenue: number | null;
          product_count: number | null;
        };
      };
      inventory_summary: {
        Row: {
          product_id: string | null;
          product_name: string | null;
          sku: string | null;
          category_name: string | null;
          current_stock: number | null;
          reorder_level: number | null;
          price: number | null;
          cost_price: number | null;
          inventory_value: number | null;
          stock_status: string | null;
        };
      };
      vendor_payment_summary: {
        Row: {
          vendor_id: string | null;
          vendor_name: string | null;
          bill_count: number | null;
          total_billed: number | null;
          total_paid: number | null;
          total_outstanding: number | null;
        };
      };
    };
    Functions: {
      least: {
        Args: {
          a: string;
          b: number;
        };
        Returns: number;
      };
      get_sales_summary: {
        Args: Record<string, never>;
        Returns: Json;
      };
      get_inventory_summary: {
        Args: Record<string, never>;
        Returns: Json;
      };
    };
    Enums: {
      // Define your enums here
    };
    CompositeTypes: {
      // Define your composite types here
    };
  };
}

type PublicSchema = Database["public"];

export type Tables<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Row"];
export type Enums<T extends keyof PublicSchema["Enums"]> =
  PublicSchema["Enums"][T];
