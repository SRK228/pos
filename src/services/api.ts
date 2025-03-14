import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database.types";

// Type definitions
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Customer = Database["public"]["Tables"]["customers"]["Row"];
export type Vendor = Database["public"]["Tables"]["vendors"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
export type Bill = Database["public"]["Tables"]["bills"]["Row"];
export type BillItem = Database["public"]["Tables"]["bill_items"]["Row"];
export type Payment = Database["public"]["Tables"]["payments"]["Row"];
export type PurchaseOrder =
  Database["public"]["Tables"]["purchase_orders"]["Row"];
export type PurchaseOrderItem =
  Database["public"]["Tables"]["purchase_order_items"]["Row"];
export type Report = Database["public"]["Tables"]["reports"]["Row"];
export type ScheduledReport =
  Database["public"]["Tables"]["scheduled_reports"]["Row"];
export type ReportHistory =
  Database["public"]["Tables"]["report_history"]["Row"];
export type InventoryTransaction =
  Database["public"]["Tables"]["inventory_transactions"]["Row"];

// Helper function to get tenant ID from JWT claims
const getTenantId = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session?.user?.app_metadata?.tenant_id;
};

// Products API
export const productsApi = {
  getAll: async () => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(name)")
      .eq("tenant_id", tenantId);
    if (error) throw error;
    return data;
  },
  getById: async (id: string) => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(name)")
      .eq("id", id)
      .eq("tenant_id", tenantId)
      .single();
    if (error) throw error;
    return data;
  },
  create: async (
    product: Omit<Product, "id" | "created_at" | "updated_at" | "tenant_id">,
  ) => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("products")
      .insert({ ...product, tenant_id: tenantId })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  update: async (id: string, product: Partial<Product>) => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("products")
      .update(product)
      .eq("id", id)
      .eq("tenant_id", tenantId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  delete: async (id: string) => {
    const tenantId = await getTenantId();
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id)
      .eq("tenant_id", tenantId);
    if (error) throw error;
  },
  getLowStock: async () => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(name)")
      .eq("tenant_id", tenantId)
      .lt("current_stock", supabase.rpc("least", { a: "reorder_level", b: 5 }));
    if (error) throw error;
    return data;
  },
};

// Categories API
export const categoriesApi = {
  getAll: async () => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("tenant_id", tenantId);
    if (error) throw error;
    return data;
  },
  getById: async (id: string) => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .eq("tenant_id", tenantId)
      .single();
    if (error) throw error;
    return data;
  },
  create: async (
    category: Omit<Category, "id" | "created_at" | "updated_at" | "tenant_id">,
  ) => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("categories")
      .insert({ ...category, tenant_id: tenantId })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  update: async (id: string, category: Partial<Category>) => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("categories")
      .update(category)
      .eq("id", id)
      .eq("tenant_id", tenantId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  delete: async (id: string) => {
    const tenantId = await getTenantId();
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id)
      .eq("tenant_id", tenantId);
    if (error) throw error;
  },
};

// Customers API
export const customersApi = {
  getAll: async () => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("tenant_id", tenantId);
    if (error) throw error;
    return data;
  },
  getById: async (id: string) => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("id", id)
      .eq("tenant_id", tenantId)
      .single();
    if (error) throw error;
    return data;
  },
  create: async (
    customer: Omit<Customer, "id" | "created_at" | "updated_at" | "tenant_id">,
  ) => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("customers")
      .insert({ ...customer, tenant_id: tenantId })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  update: async (id: string, customer: Partial<Customer>) => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("customers")
      .update(customer)
      .eq("id", id)
      .eq("tenant_id", tenantId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  delete: async (id: string) => {
    const tenantId = await getTenantId();
    const { error } = await supabase
      .from("customers")
      .delete()
      .eq("id", id)
      .eq("tenant_id", tenantId);
    if (error) throw error;
  },
};

// Vendors API
export const vendorsApi = {
  getAll: async () => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("vendors")
      .select("*")
      .eq("tenant_id", tenantId);
    if (error) throw error;
    return data;
  },
  getById: async (id: string) => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("vendors")
      .select("*")
      .eq("id", id)
      .eq("tenant_id", tenantId)
      .single();
    if (error) throw error;
    return data;
  },
  create: async (
    vendor: Omit<Vendor, "id" | "created_at" | "updated_at" | "tenant_id">,
  ) => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("vendors")
      .insert({ ...vendor, tenant_id: tenantId })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  update: async (id: string, vendor: Partial<Vendor>) => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("vendors")
      .update(vendor)
      .eq("id", id)
      .eq("tenant_id", tenantId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  delete: async (id: string) => {
    const tenantId = await getTenantId();
    const { error } = await supabase
      .from("vendors")
      .delete()
      .eq("id", id)
      .eq("tenant_id", tenantId);
    if (error) throw error;
  },
};

// Orders API
export const ordersApi = {
  getAll: async () => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("orders")
      .select("*, customers(name)")
      .eq("tenant_id", tenantId);
    if (error) throw error;
    return data;
  },
  getById: async (id: string) => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("orders")
      .select("*, customers(name), order_items(*, products(name, sku, price))")
      .eq("id", id)
      .eq("tenant_id", tenantId)
      .single();
    if (error) throw error;
    return data;
  },
  create: async (
    order: Omit<Order, "id" | "created_at" | "updated_at" | "tenant_id">,
    items: Omit<OrderItem, "id" | "order_id" | "created_at" | "updated_at">[],
  ) => {
    const tenantId = await getTenantId();
    // Start a transaction
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({ ...order, tenant_id: tenantId })
      .select()
      .single();

    if (orderError) throw orderError;

    // Add order items
    const orderItems = items.map((item) => ({
      ...item,
      order_id: orderData.id,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // Create inventory transactions for each item
    const inventoryTransactions = items.map((item) => ({
      product_id: item.product_id,
      transaction_type: "sale",
      quantity: item.quantity,
      reference_id: orderData.id,
      reference_type: "order",
      tenant_id: tenantId,
    }));

    const { error: inventoryError } = await supabase
      .from("inventory_transactions")
      .insert(inventoryTransactions);

    if (inventoryError) throw inventoryError;

    return orderData;
  },
  update: async (id: string, order: Partial<Order>) => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("orders")
      .update(order)
      .eq("id", id)
      .eq("tenant_id", tenantId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  delete: async (id: string) => {
    const tenantId = await getTenantId();
    const { error } = await supabase
      .from("orders")
      .delete()
      .eq("id", id)
      .eq("tenant_id", tenantId);
    if (error) throw error;
  },
};

// Bills API
export const billsApi = {
  getAll: async () => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("bills")
      .select("*, vendors(name)")
      .eq("tenant_id", tenantId);
    if (error) throw error;
    return data;
  },
  getById: async (id: string) => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("bills")
      .select("*, vendors(name), bill_items(*, products(name, sku, price))")
      .eq("id", id)
      .eq("tenant_id", tenantId)
      .single();
    if (error) throw error;
    return data;
  },
  create: async (
    bill: Omit<Bill, "id" | "created_at" | "updated_at" | "tenant_id">,
    items: Omit<BillItem, "id" | "bill_id" | "created_at" | "updated_at">[],
  ) => {
    const tenantId = await getTenantId();
    // Start a transaction
    const { data: billData, error: billError } = await supabase
      .from("bills")
      .insert({ ...bill, tenant_id: tenantId })
      .select()
      .single();

    if (billError) throw billError;

    // Add bill items
    const billItems = items.map((item) => ({
      ...item,
      bill_id: billData.id,
    }));

    const { error: itemsError } = await supabase
      .from("bill_items")
      .insert(billItems);

    if (itemsError) throw itemsError;

    // Create inventory transactions for each item
    const inventoryTransactions = items.map((item) => ({
      product_id: item.product_id,
      transaction_type: "purchase",
      quantity: item.quantity,
      reference_id: billData.id,
      reference_type: "bill",
      tenant_id: tenantId,
    }));

    const { error: inventoryError } = await supabase
      .from("inventory_transactions")
      .insert(inventoryTransactions);

    if (inventoryError) throw inventoryError;

    return billData;
  },
  update: async (id: string, bill: Partial<Bill>) => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("bills")
      .update(bill)
      .eq("id", id)
      .eq("tenant_id", tenantId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  delete: async (id: string) => {
    const tenantId = await getTenantId();
    const { error } = await supabase
      .from("bills")
      .delete()
      .eq("id", id)
      .eq("tenant_id", tenantId);
    if (error) throw error;
  },
};

// Payments API
export const paymentsApi = {
  getAll: async () => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("payments")
      .select("*, vendors(name), bills(bill_number)")
      .eq("tenant_id", tenantId);
    if (error) throw error;
    return data;
  },
  getById: async (id: string) => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("payments")
      .select("*, vendors(name), bills(bill_number)")
      .eq("id", id)
      .eq("tenant_id", tenantId)
      .single();
    if (error) throw error;
    return data;
  },
  create: async (
    payment: Omit<Payment, "id" | "created_at" | "updated_at" | "tenant_id">,
  ) => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("payments")
      .insert({ ...payment, tenant_id: tenantId })
      .select()
      .single();
    if (error) throw error;

    // If this payment is for a bill, update the bill status
    if (payment.bill_id) {
      const { data: billData } = await supabase
        .from("bills")
        .select("total_amount, status")
        .eq("id", payment.bill_id)
        .eq("tenant_id", tenantId)
        .single();

      if (billData) {
        // Get total payments for this bill
        const { data: paymentsData } = await supabase
          .from("payments")
          .select("amount")
          .eq("bill_id", payment.bill_id)
          .eq("tenant_id", tenantId);

        const totalPaid = (paymentsData || []).reduce(
          (sum, p) => sum + (p.amount || 0),
          0,
        );

        let newStatus = billData.status;
        if (totalPaid >= billData.total_amount) {
          newStatus = "paid";
        } else if (totalPaid > 0) {
          newStatus = "partial";
        }

        await supabase
          .from("bills")
          .update({ status: newStatus })
          .eq("id", payment.bill_id)
          .eq("tenant_id", tenantId);
      }
    }

    return data;
  },
  update: async (id: string, payment: Partial<Payment>) => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("payments")
      .update(payment)
      .eq("id", id)
      .eq("tenant_id", tenantId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  delete: async (id: string) => {
    const tenantId = await getTenantId();
    const { error } = await supabase
      .from("payments")
      .delete()
      .eq("id", id)
      .eq("tenant_id", tenantId);
    if (error) throw error;
  },
};

// Purchase Orders API
export const purchaseOrdersApi = {
  getAll: async () => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("purchase_orders")
      .select("*, vendors(name)")
      .eq("tenant_id", tenantId);
    if (error) throw error;
    return data;
  },
  getById: async (id: string) => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("purchase_orders")
      .select(
        "*, vendors(name), purchase_order_items(*, products(name, sku, price))",
      )
      .eq("id", id)
      .eq("tenant_id", tenantId)
      .single();
    if (error) throw error;
    return data;
  },
  create: async (
    purchaseOrder: Omit<
      PurchaseOrder,
      "id" | "created_at" | "updated_at" | "tenant_id"
    >,
    items: Omit<
      PurchaseOrderItem,
      "id" | "purchase_order_id" | "created_at" | "updated_at"
    >[],
  ) => {
    const tenantId = await getTenantId();
    // Start a transaction
    const { data: poData, error: poError } = await supabase
      .from("purchase_orders")
      .insert({ ...purchaseOrder, tenant_id: tenantId })
      .select()
      .single();

    if (poError) throw poError;

    // Add purchase order items
    const poItems = items.map((item) => ({
      ...item,
      purchase_order_id: poData.id,
    }));

    const { error: itemsError } = await supabase
      .from("purchase_order_items")
      .insert(poItems);

    if (itemsError) throw itemsError;

    return poData;
  },
  update: async (id: string, purchaseOrder: Partial<PurchaseOrder>) => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("purchase_orders")
      .update(purchaseOrder)
      .eq("id", id)
      .eq("tenant_id", tenantId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  delete: async (id: string) => {
    const tenantId = await getTenantId();
    const { error } = await supabase
      .from("purchase_orders")
      .delete()
      .eq("id", id)
      .eq("tenant_id", tenantId);
    if (error) throw error;
  },
};

// Reports API
export const reportsApi = {
  getAll: async () => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .eq("tenant_id", tenantId);
    if (error) throw error;
    return data;
  },
  getById: async (id: string) => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .eq("id", id)
      .eq("tenant_id", tenantId)
      .single();
    if (error) throw error;
    return data;
  },
  create: async (
    report: Omit<Report, "id" | "created_at" | "updated_at" | "tenant_id">,
  ) => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("reports")
      .insert({ ...report, tenant_id: tenantId })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  update: async (id: string, report: Partial<Report>) => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("reports")
      .update(report)
      .eq("id", id)
      .eq("tenant_id", tenantId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  delete: async (id: string) => {
    const tenantId = await getTenantId();
    const { error } = await supabase
      .from("reports")
      .delete()
      .eq("id", id)
      .eq("tenant_id", tenantId);
    if (error) throw error;
  },
  toggleFavorite: async (id: string, isFavorite: boolean) => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("reports")
      .update({ is_favorite: isFavorite })
      .eq("id", id)
      .eq("tenant_id", tenantId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  getByModule: async (module: string) => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .eq("module", module)
      .eq("tenant_id", tenantId);
    if (error) throw error;
    return data;
  },
  getFavorites: async () => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .eq("is_favorite", true)
      .eq("tenant_id", tenantId);
    if (error) throw error;
    return data;
  },
  getCustomReports: async () => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .eq("is_custom", true)
      .eq("tenant_id", tenantId);
    if (error) throw error;
    return data;
  },
};

// Scheduled Reports API
export const scheduledReportsApi = {
  getAll: async () => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("scheduled_reports")
      .select("*, reports(name)")
      .eq("tenant_id", tenantId);
    if (error) throw error;
    return data;
  },
  getById: async (id: string) => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("scheduled_reports")
      .select("*, reports(name)")
      .eq("id", id)
      .eq("tenant_id", tenantId)
      .single();
    if (error) throw error;
    return data;
  },
  create: async (
    scheduledReport: Omit<
      ScheduledReport,
      "id" | "created_at" | "updated_at" | "tenant_id"
    >,
  ) => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("scheduled_reports")
      .insert({ ...scheduledReport, tenant_id: tenantId })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  update: async (id: string, scheduledReport: Partial<ScheduledReport>) => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("scheduled_reports")
      .update(scheduledReport)
      .eq("id", id)
      .eq("tenant_id", tenantId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  delete: async (id: string) => {
    const tenantId = await getTenantId();
    const { error } = await supabase
      .from("scheduled_reports")
      .delete()
      .eq("id", id)
      .eq("tenant_id", tenantId);
    if (error) throw error;
  },
  toggleActive: async (id: string, isActive: boolean) => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("scheduled_reports")
      .update({ is_active: isActive })
      .eq("id", id)
      .eq("tenant_id", tenantId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

// Report History API
export const reportHistoryApi = {
  getAll: async () => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("report_history")
      .select("*, reports(name)")
      .eq("tenant_id", tenantId);
    if (error) throw error;
    return data;
  },
  getByReportId: async (reportId: string) => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("report_history")
      .select("*, reports(name)")
      .eq("report_id", reportId)
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },
  create: async (
    reportHistory: Omit<ReportHistory, "id" | "created_at" | "tenant_id">,
  ) => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("report_history")
      .insert({ ...reportHistory, tenant_id: tenantId })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  delete: async (id: string) => {
    const tenantId = await getTenantId();
    const { error } = await supabase
      .from("report_history")
      .delete()
      .eq("id", id)
      .eq("tenant_id", tenantId);
    if (error) throw error;
  },
};

// Dashboard API
export const dashboardApi = {
  getSalesSummary: async () => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase.rpc("get_sales_summary", {
      p_tenant_id: tenantId,
    });
    if (error) throw error;
    return data || { total_sales: 0, order_count: 0, average_order_value: 0 };
  },
  getInventorySummary: async () => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase.rpc("get_inventory_summary", {
      p_tenant_id: tenantId,
    });
    if (error) throw error;
    return (
      data || {
        total_products: 0,
        total_stock: 0,
        inventory_value: 0,
        low_stock_count: 0,
      }
    );
  },
  getTopSellingProducts: async (limit = 5) => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("sales_by_product")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("total_revenue", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  },
  getSalesByCategory: async () => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("sales_by_category")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("total_revenue", { ascending: false });
    if (error) throw error;
    return data || [];
  },
  getRecentOrders: async (limit = 5) => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("orders")
      .select("*, customers(name)")
      .eq("tenant_id", tenantId)
      .order("order_date", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  },
  getLowStockItems: async () => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase
      .from("inventory_summary")
      .select("*")
      .eq("tenant_id", tenantId)
      .eq("stock_status", "Low Stock");
    if (error) throw error;
    return data || [];
  },
};
