"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Search } from "lucide-react";
import { formatCurrency } from "@/utils/format";

interface Customer {
  id: string;
  name: string;
  phone: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
}

interface Variant {
  id: string;
  color: string;
  size: string;
  sku: string;
  stock: number;
  product: Product;
}

interface OrderItemEntry {
  variant: Variant | null;
  quantity: number;
}

interface OrderFormProps {
  mode: "create" | "edit";
  initialData?: {
    id: string;
    customerId: string;
    customer: { id: string; name: string; phone: string };
    notes: string | null;
    items: Array<{
      id: string;
      variantId: string;
      quantity: number;
      price: number;
      variant: Variant;
    }>;
  };
}

export function OrderForm({ mode, initialData }: OrderFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const [customerId, setCustomerId] = useState(initialData?.customerId ?? "");
  const [customerSearch, setCustomerSearch] = useState(
    initialData?.customer.name ?? ""
  );
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [notes, setNotes] = useState(initialData?.notes ?? "");
  const [items, setItems] = useState<OrderItemEntry[]>(
    initialData?.items.map((i) => ({
      variant: i.variant,
      quantity: i.quantity,
    })) ?? [{ variant: null, quantity: 1 }]
  );
  const [submitting, setSubmitting] = useState(false);

  const [productSearch, setProductSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  const searchCustomers = useCallback(async (q: string) => {
    if (!q.trim()) {
      setCustomers([]);
      return;
    }
    try {
      const res = await fetch(`/api/customers?search=${encodeURIComponent(q)}&limit=10`);
      const result = await res.json();
      if (result.success) {
        setCustomers(result.data?.data ?? []);
      }
    } catch {
      setCustomers([]);
    }
  }, []);

  const searchProducts = useCallback(async (q: string) => {
    if (!q.trim()) {
      setProducts([]);
      return;
    }
    try {
      const res = await fetch(`/api/products?search=${encodeURIComponent(q)}&limit=10`);
      const result = await res.json();
      if (result.success) {
        setProducts(result.data?.data ?? []);
      }
    } catch {
      setProducts([]);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => searchCustomers(customerSearch), 300);
    return () => clearTimeout(timer);
  }, [customerSearch, searchCustomers]);

  useEffect(() => {
    const timer = setTimeout(() => searchProducts(productSearch), 300);
    return () => clearTimeout(timer);
  }, [productSearch, searchProducts]);

  async function addItem(index: number, variant: Variant) {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], variant };
    setItems(newItems);
    setShowProductDropdown(false);
    setProductSearch("");
  }

  function removeItem(index: number) {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  }

  function addNewItem() {
    setItems([...items, { variant: null, quantity: 1 }]);
  }

  function updateQuantity(index: number, quantity: number) {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], quantity: Math.max(1, quantity) };
    setItems(newItems);
  }

  function getTotal(): number {
    return items.reduce((sum, item) => {
      if (!item.variant) return sum;
      return sum + Number(item.variant.product.price) * item.quantity;
    }, 0);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!customerId) {
      toast.error("Please select a customer");
      return;
    }

    const validItems = items.filter((i) => i.variant);
    if (validItems.length === 0) {
      toast.error("Please add at least one item with a variant");
      return;
    }

    setSubmitting(true);

    try {
      const body = {
        customerId,
        notes: notes || null,
        items: validItems.map((i) => ({
          variantId: i.variant!.id,
          quantity: i.quantity,
        })),
      };

      const url = isEdit
        ? `/api/orders/${initialData!.id}`
        : "/api/orders";
      const method = isEdit ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error ?? "Failed to save order");
      }

      toast.success(
        isEdit ? "Order updated successfully" : "Order created successfully"
      );
      router.push(`/dashboard/orders/${result.data.id}`);
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer">Customer</Label>
            <div className="relative">
              <Input
                id="customer"
                value={customerSearch}
                onChange={(e) => {
                  setCustomerSearch(e.target.value);
                  setShowCustomerDropdown(true);
                  if (!e.target.value) {
                    setCustomerId("");
                  }
                }}
                onFocus={() => setShowCustomerDropdown(true)}
                onBlur={() =>
                  setTimeout(() => setShowCustomerDropdown(false), 200)
                }
                placeholder="Search customers..."
              />
              {showCustomerDropdown && customers.length > 0 && (
                <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-md">
                  {customers.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      className="w-full px-3 py-2 text-left text-sm hover:bg-muted"
                      onMouseDown={() => {
                        setCustomerId(c.id);
                        setCustomerSearch(`${c.name} (${c.phone})`);
                        setShowCustomerDropdown(false);
                      }}
                    >
                      <span className="font-medium">{c.name}</span>
                      <span className="ml-2 text-muted-foreground">
                        {c.phone}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Order notes..."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Order Items</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addNewItem}
          >
            <Plus className="size-4 mr-1" />
            Add Item
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-4 rounded-lg border p-4"
            >
              <div className="flex-1 space-y-2">
                <Label>Product & Variant</Label>
                {item.variant ? (
                  <div className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2">
                    <div>
                      <span className="font-medium">
                        {item.variant.product.name}
                      </span>
                      <span className="ml-2 text-sm text-muted-foreground">
                        {item.variant.color} / {item.variant.size}
                      </span>
                      <span className="ml-2 text-xs font-mono text-muted-foreground">
                        SKU: {item.variant.sku}
                      </span>
                    </div>
                    <span className="text-sm font-medium">
                      {formatCurrency(Number(item.variant.product.price))} ea
                    </span>
                  </div>
                ) : (
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={productSearch}
                      onChange={(e) => {
                        setProductSearch(e.target.value);
                        setShowProductDropdown(true);
                      }}
                      onFocus={() => setShowProductDropdown(true)}
                      onBlur={() =>
                        setTimeout(() => setShowProductDropdown(false), 200)
                      }
                      placeholder="Search products..."
                      className="pl-8"
                    />
                    {showProductDropdown && products.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-md max-h-60 overflow-y-auto">
                        {products.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            className="w-full px-3 py-2 text-left text-sm hover:bg-muted"
                            onMouseDown={async () => {
                              try {
                                const res = await fetch(
                                  `/api/products/${p.id}`
                                );
                                const result = await res.json();
                                if (
                                  result.success &&
                                  result.data?.variants?.length > 0
                                ) {
                                  const variant = {
                                    ...result.data.variants[0],
                                    product: {
                                      id: p.id,
                                      name: p.name,
                                      price: p.price,
                                    },
                                  };
                                  addItem(index, variant);
                                } else {
                                  toast.error(
                                    "This product has no variants"
                                  );
                                }
                              } catch {
                                toast.error("Failed to load product");
                              }
                            }}
                          >
                            <span className="font-medium">{p.name}</span>
                            <span className="ml-2 text-muted-foreground">
                              {formatCurrency(Number(p.price))}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="w-24 space-y-2">
                <Label>Qty</Label>
                <Input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(index, parseInt(e.target.value) || 1)
                  }
                />
              </div>

              <div className="w-24 space-y-2 pt-6">
                <span className="text-sm font-medium">
                  {item.variant
                    ? formatCurrency(
                        Number(item.variant.product.price) * item.quantity
                      )
                    : "-"}
                </span>
              </div>

              {items.length > 1 && (
                <div className="pt-6">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeItem(index)}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              )}
            </div>
          ))}

          <div className="flex items-center justify-between border-t pt-4">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-lg font-bold">
              {formatCurrency(getTotal())}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting
            ? "Saving..."
            : isEdit
            ? "Update Order"
            : "Create Order"}
        </Button>
      </div>
    </form>
  );
}
