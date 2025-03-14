export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bill_items: {
        Row: {
          account: string
          bill_id: string | null
          created_at: string | null
          id: string
          product_id: string | null
          quantity: number
          total_price: number
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          account: string
          bill_id?: string | null
          created_at?: string | null
          id?: string
          product_id?: string | null
          quantity: number
          total_price: number
          unit_price: number
          updated_at?: string | null
        }
        Update: {
          account?: string
          bill_id?: string | null
          created_at?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
          total_price?: number
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bill_items_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "bills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bill_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_summary"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "bill_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bill_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "sales_by_product"
            referencedColumns: ["product_id"]
          },
        ]
      }
      bills: {
        Row: {
          bill_date: string | null
          bill_number: string
          created_at: string | null
          discount_amount: number | null
          due_date: string | null
          id: string
          notes: string | null
          purchase_order_id: string | null
          status: string
          subtotal: number
          tax_amount: number
          total_amount: number
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          bill_date?: string | null
          bill_number: string
          created_at?: string | null
          discount_amount?: number | null
          due_date?: string | null
          id?: string
          notes?: string | null
          purchase_order_id?: string | null
          status: string
          subtotal: number
          tax_amount: number
          total_amount: number
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          bill_date?: string | null
          bill_number?: string
          created_at?: string | null
          discount_amount?: number | null
          due_date?: string | null
          id?: string
          notes?: string | null
          purchase_order_id?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bills_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bills_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_payment_summary"
            referencedColumns: ["vendor_id"]
          },
          {
            foreignKeyName: "bills_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          postal_code: string | null
          state: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      inventory_transactions: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          product_id: string | null
          quantity: number
          reference_id: string | null
          reference_type: string | null
          transaction_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          product_id?: string | null
          quantity: number
          reference_id?: string | null
          reference_type?: string | null
          transaction_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          product_id?: string | null
          quantity?: number
          reference_id?: string | null
          reference_type?: string | null
          transaction_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_transactions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_summary"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "inventory_transactions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transactions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "sales_by_product"
            referencedColumns: ["product_id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string | null
          product_id: string | null
          quantity: number
          total_price: number
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          product_id?: string | null
          quantity: number
          total_price: number
          unit_price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          product_id?: string | null
          quantity?: number
          total_price?: number
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_summary"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "sales_by_product"
            referencedColumns: ["product_id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          customer_id: string | null
          delivery_address: string | null
          delivery_method: string | null
          discount_amount: number | null
          id: string
          notes: string | null
          order_date: string | null
          order_number: string
          payment_method: string
          payment_status: string
          status: string
          subtotal: number
          tax_amount: number
          total_amount: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          delivery_address?: string | null
          delivery_method?: string | null
          discount_amount?: number | null
          id?: string
          notes?: string | null
          order_date?: string | null
          order_number: string
          payment_method: string
          payment_status: string
          status: string
          subtotal: number
          tax_amount: number
          total_amount: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          delivery_address?: string | null
          delivery_method?: string | null
          discount_amount?: number | null
          id?: string
          notes?: string | null
          order_date?: string | null
          order_number?: string
          payment_method?: string
          payment_status?: string
          status?: string
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          bill_id: string | null
          created_at: string | null
          id: string
          notes: string | null
          payment_date: string | null
          payment_mode: string
          payment_number: string
          reference: string | null
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          amount: number
          bill_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          payment_date?: string | null
          payment_mode: string
          payment_number: string
          reference?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          amount?: number
          bill_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          payment_date?: string | null
          payment_mode?: string
          payment_number?: string
          reference?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "bills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_payment_summary"
            referencedColumns: ["vendor_id"]
          },
          {
            foreignKeyName: "payments_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          barcode: string | null
          category_id: string | null
          cost_price: number
          created_at: string | null
          current_stock: number
          description: string | null
          id: string
          image_url: string | null
          name: string
          price: number
          reorder_level: number
          sku: string
          updated_at: string | null
        }
        Insert: {
          barcode?: string | null
          category_id?: string | null
          cost_price: number
          created_at?: string | null
          current_stock?: number
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price: number
          reorder_level?: number
          sku: string
          updated_at?: string | null
        }
        Update: {
          barcode?: string | null
          category_id?: string | null
          cost_price?: number
          created_at?: string | null
          current_stock?: number
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          reorder_level?: number
          sku?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "sales_by_category"
            referencedColumns: ["category_id"]
          },
        ]
      }
      purchase_order_items: {
        Row: {
          created_at: string | null
          id: string
          product_id: string | null
          purchase_order_id: string | null
          quantity: number
          total_price: number
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          purchase_order_id?: string | null
          quantity: number
          total_price: number
          unit_price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          purchase_order_id?: string | null
          quantity?: number
          total_price?: number
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_summary"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "purchase_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "sales_by_product"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "purchase_order_items_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          created_at: string | null
          discount_amount: number | null
          expected_delivery_date: string | null
          id: string
          notes: string | null
          order_date: string | null
          po_number: string
          status: string
          subtotal: number
          tax_amount: number
          total_amount: number
          updated_at: string | null
          user_id: string | null
          vendor_id: string | null
        }
        Insert: {
          created_at?: string | null
          discount_amount?: number | null
          expected_delivery_date?: string | null
          id?: string
          notes?: string | null
          order_date?: string | null
          po_number: string
          status: string
          subtotal: number
          tax_amount: number
          total_amount: number
          updated_at?: string | null
          user_id?: string | null
          vendor_id?: string | null
        }
        Update: {
          created_at?: string | null
          discount_amount?: number | null
          expected_delivery_date?: string | null
          id?: string
          notes?: string | null
          order_date?: string | null
          po_number?: string
          status?: string
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string | null
          user_id?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_payment_summary"
            referencedColumns: ["vendor_id"]
          },
          {
            foreignKeyName: "purchase_orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      report_history: {
        Row: {
          created_at: string | null
          file_url: string | null
          id: string
          parameters: Json | null
          report_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          file_url?: string | null
          id?: string
          parameters?: Json | null
          report_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          file_url?: string | null
          id?: string
          parameters?: Json | null
          report_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "report_history_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          fields: Json
          filters: Json | null
          id: string
          is_custom: boolean | null
          is_favorite: boolean | null
          module: string
          name: string
          sorting: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          fields: Json
          filters?: Json | null
          id?: string
          is_custom?: boolean | null
          is_favorite?: boolean | null
          module: string
          name: string
          sorting?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          fields?: Json
          filters?: Json | null
          id?: string
          is_custom?: boolean | null
          is_favorite?: boolean | null
          module?: string
          name?: string
          sorting?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduled_reports: {
        Row: {
          created_at: string | null
          day_of_month: number | null
          day_of_week: number | null
          format: string
          frequency: string
          id: string
          is_active: boolean | null
          last_run: string | null
          recipients: Json | null
          report_id: string | null
          time_of_day: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          day_of_month?: number | null
          day_of_week?: number | null
          format: string
          frequency: string
          id?: string
          is_active?: boolean | null
          last_run?: string | null
          recipients?: Json | null
          report_id?: string | null
          time_of_day?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          day_of_month?: number | null
          day_of_week?: number | null
          format?: string
          frequency?: string
          id?: string
          is_active?: boolean | null
          last_run?: string | null
          recipients?: Json | null
          report_id?: string | null
          time_of_day?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_reports_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          password: string
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          password: string
          role: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          password?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      vendors: {
        Row: {
          address: string | null
          city: string | null
          company: string | null
          country: string | null
          created_at: string | null
          currency: string | null
          email: string | null
          id: string
          is_msme: boolean | null
          mobile: string | null
          name: string
          pan: string | null
          payment_terms: string | null
          phone: string | null
          postal_code: string | null
          state: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          email?: string | null
          id?: string
          is_msme?: boolean | null
          mobile?: string | null
          name: string
          pan?: string | null
          payment_terms?: string | null
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          email?: string | null
          id?: string
          is_msme?: boolean | null
          mobile?: string | null
          name?: string
          pan?: string | null
          payment_terms?: string | null
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      inventory_summary: {
        Row: {
          category_name: string | null
          cost_price: number | null
          current_stock: number | null
          inventory_value: number | null
          price: number | null
          product_id: string | null
          product_name: string | null
          reorder_level: number | null
          sku: string | null
          stock_status: string | null
        }
        Relationships: []
      }
      sales_by_category: {
        Row: {
          category_id: string | null
          category_name: string | null
          product_count: number | null
          total_quantity_sold: number | null
          total_revenue: number | null
        }
        Relationships: []
      }
      sales_by_product: {
        Row: {
          category_name: string | null
          order_count: number | null
          product_id: string | null
          product_name: string | null
          sku: string | null
          total_quantity_sold: number | null
          total_revenue: number | null
        }
        Relationships: []
      }
      vendor_payment_summary: {
        Row: {
          bill_count: number | null
          total_billed: number | null
          total_outstanding: number | null
          total_paid: number | null
          vendor_id: string | null
          vendor_name: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
