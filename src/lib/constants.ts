export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  PRODUCTS: "/dashboard/products",
  CATEGORIES: "/dashboard/categories",
  INVENTORY: "/dashboard/inventory",
  CUSTOMERS: "/dashboard/customers",
  ORDERS: "/dashboard/orders",
} as const;

export const APP_NAME = "Aara Clothing";
export const APP_DESCRIPTION = "Internal Inventory & Order Management System";

export const ORDER_STATUSES = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export type OrderStatus = (typeof ORDER_STATUSES)[keyof typeof ORDER_STATUSES];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const ORDER_STATUS_FLOW: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

export function getValidOrderStatusTransitions(
  current: OrderStatus
): OrderStatus[] {
  return ORDER_STATUS_FLOW[current] ?? [];
}

export function canEditOrder(status: OrderStatus): boolean {
  return status === ORDER_STATUSES.PENDING || status === ORDER_STATUSES.PROCESSING;
}

export const ORDER_STATUS_VARIANTS: Record<OrderStatus, "default" | "secondary" | "success" | "destructive" | "warning" | "outline"> = {
  PENDING: "warning",
  PROCESSING: "default",
  COMPLETED: "success",
  CANCELLED: "destructive",
};

export const STOCK_THRESHOLDS = {
  LOW: 10,
  OUT: 0,
} as const;

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export function getStockStatus(stock: number): StockStatus {
  if (stock <= STOCK_THRESHOLDS.OUT) return "out_of_stock";
  if (stock <= STOCK_THRESHOLDS.LOW) return "low_stock";
  return "in_stock";
}

export const STOCK_STATUS_LABELS: Record<StockStatus, string> = {
  in_stock: "In Stock",
  low_stock: "Low Stock",
  out_of_stock: "Out of Stock",
};

export const LOW_STOCK_THRESHOLD = STOCK_THRESHOLDS.LOW;
