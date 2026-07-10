"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Plus, Trash2, Save } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  variants: { id: string; color: string; size: string; sku: string; stock: number }[];
}

interface OrderItemRow {
  variantId: string;
  productName: string;
  variantLabel: string;
  quantity: number;
  stock: number;
}

interface OrderFormProps {
  customerId: string;
  orderId?: string;
  initialItems?: OrderItemRow[];
  mode: "create" | "edit";
}

export function OrderForm({ customerId, orderId, initialItems, mode }: OrderFormProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [items, setItems] = useState<OrderItemRow[]>(initialItems ?? []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/inventory?limit=1000");
        const data = await res.json();
        if (data.success) {
          const inventoryItems = data.data?.data ?? [];
          const productMap = new Map<string, Product>();

          for (const inv of inventoryItems) {
            if (!productMap.has(inv.product.id)) {
              productMap.set(inv.product.id, {
                id: inv.product.id,
                name: inv.product.name,
                price: 0,
                variants: [],
              });
            }
            productMap.get(inv.product.id)!.variants.push({
              id: inv.id,
              color: inv.color,
              size: inv.size,
              sku: inv.sku,
              stock: inv.stock,
            });
          }

          const productPrices = await Promise.all(
            Array.from(productMap.keys()).map(async (pid) => {
              const res = await fetch(`/api/inventory/${pid}`);
              const data = await res.json();
              return data.success ? { id: pid, price: data.data?.price ?? 0 } : null;
            })
          );

          for (const pp of productPrices) {
            if (pp) {
              const p = productMap.get(pp.id);
              if (p) p.price = Number(pp.price);
            }
          }

          setProducts(Array.from(productMap.values()));
        }
      } catch {
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const variants = selectedProduct?.variants ?? [];

  function handleAddItem() {
    if (!selectedVariantId) {
      toast.error("Please select a variant");
      return;
    }
    if (quantity < 1) {
      toast.error("Quantity must be greater than zero");
      return;
    }

    const variant = variants.find((v) => v.id === selectedVariantId);
    if (!variant) return;

    if (variant.stock < quantity) {
      toast.error(`Insufficient stock. Available: ${variant.stock}`);
      return;
    }

    if (items.some((i) => i.variantId === selectedVariantId)) {
      toast.error("This variant is already in the order");
      return;
    }

    setItems([
      ...items,
      {
        variantId: selectedVariantId,
        productName: selectedProduct?.name ?? "",
        variantLabel: `${variant.color} / ${variant.size} (${variant.sku})`,
        quantity,
        stock: variant.stock,
      },
    ]);

    setSelectedVariantId("");
    setQuantity(1);
  }

  function handleRemoveItem(variantId: string) {
    setItems(items.filter((i) => i.variantId !== variantId));
  }

  async function handleSubmit() {
    if (items.length === 0) {
      toast.error("Add at least one item");
      return;
    }

    setIsSubmitting(true);
    try {
      const body = {
        ...(mode === "create" ? { customerId } : {}),
        items: items.map((i) => ({
          variantId: i.variantId,
          quantity: i.quantity,
        })),
      };

      const url = mode === "create"
        ? "/api/orders"
        : `/api/orders/${orderId}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.error);

      toast.success(
        mode === "create" ? "Order created successfully" : "Order updated successfully"
      );
      router.push(`/dashboard/customers/${customerId}`);
      router.refresh();
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return <div className="p-6 text-muted-foreground">Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{mode === "create" ? "Create New Order" : "Edit Order"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Product</Label>
                <Select
                  value={selectedProductId}
                  onChange={setSelectedProductId}
                  placeholder="Select a product"
                  items={products.map((p) => ({
                    value: p.id,
                    label: p.name,
                  }))}
                />
              </div>

              {selectedProductId && (
                <div className="space-y-2">
                  <Label>Variant</Label>
                  <Select
                    value={selectedVariantId}
                    onChange={setSelectedVariantId}
                    placeholder="Select variant"
                    items={variants.map((v) => ({
                      value: v.id,
                      label: `${v.color} / ${v.size} (Stock: ${v.stock})`,
                    }))}
                  />
                </div>
              )}

              {selectedVariantId && (
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="min-w-0 flex-1"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleAddItem}
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="mt-6 space-y-2">
                <Label>Order Items</Label>
                <div className="overflow-x-auto rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="px-4 py-2 font-medium text-muted-foreground">Product</th>
                        <th className="px-4 py-2 font-medium text-muted-foreground">Variant</th>
                        <th className="px-4 py-2 font-medium text-muted-foreground">Qty</th>
                        <th className="px-4 py-2 font-medium text-muted-foreground">Stock</th>
                        <th className="px-4 py-2" />
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.variantId} className="border-b last:border-0">
                          <td className="px-4 py-2">{item.productName}</td>
                          <td className="px-4 py-2">{item.variantLabel}</td>
                          <td className="px-4 py-2">{item.quantity}</td>
                          <td className="px-4 py-2">{item.stock}</td>
                          <td className="px-4 py-2">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleRemoveItem(item.variantId)}
                            >
                              <Trash2 className="size-4 text-destructive" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || items.length === 0}
              >
                <Save className="size-4" />
                {isSubmitting
                  ? "Saving..."
                  : mode === "create"
                  ? "Create Order"
                  : "Update Order"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
