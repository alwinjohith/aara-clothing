export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface User {
  id: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  parent?: { id: string; name: string } | null;
  children?: { id: string; name: string }[];
  _count?: { children: number; products: number };
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  categoryId: string;
  category?: { id: string; name: string };
  isActive: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  variants?: ProductVariant[];
  _count?: { variants: number };
}

export interface ProductVariant {
  id: string;
  productId: string;
  color: string;
  size: string;
  sku: string;
  stock: number;
  images: VariantImage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface VariantImage {
  id: string;
  variantId: string;
  url: string;
  createdAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  total: number;
  notes: string | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  customer?: Customer;
  items?: OrderItem[];
  user?: { id: string; username: string };
}

export interface OrderItem {
  id: string;
  orderId: string;
  variantId: string;
  quantity: number;
  price: number;
  subtotal: number;
  variant?: ProductVariant & { product?: { id: string; name: string; price: number } };
}

export type OrderStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";
