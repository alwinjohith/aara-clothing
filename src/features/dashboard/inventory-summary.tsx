"use client";

import { useEffect, useState, useCallback, useTransition } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Package, ChevronRight } from "lucide-react";
import { useDashboardRefresh } from "@/components/providers/dashboard-refresh-provider";
import { cn } from "@/lib/utils";
import { STOCK_STATUS_LABELS } from "@/lib/constants";

interface VariantItem {
  variantId: string;
  productName: string;
  productId: string;
  color: string | null;
  size: string | null;
  stock: number;
  status: "in_stock" | "low_stock" | "out_of_stock";
}

interface ProductGroup {
  productId: string;
  productName: string;
  variants: VariantItem[];
  totalStock: number;
}

interface Stats {
  totalProducts: number;
  totalVariants: number;
  totalStockUnits: number;
  lowStockProducts: number;
  outOfStockProducts: number;
}

interface Props {
  initialStats: Stats;
}

const stockBadgeVariant: Record<string, "success" | "warning" | "destructive"> = {
  in_stock: "success",
  low_stock: "warning",
  out_of_stock: "destructive",
};

function groupByProduct(variants: VariantItem[]): ProductGroup[] {
  const map = new Map<string, ProductGroup>();
  for (const v of variants) {
    let group = map.get(v.productId);
    if (!group) {
      group = { productId: v.productId, productName: v.productName, variants: [], totalStock: 0 };
      map.set(v.productId, group);
    }
    group.variants.push(v);
    group.totalStock += v.stock;
  }
  return Array.from(map.values());
}

function ProductSkeleton() {
  return (
    <div className="rounded-xl border border-border/30 p-3.5">
      <div className="flex items-center gap-3">
        <Skeleton className="size-5 rounded" />
        <Skeleton className="h-4 w-32 rounded-md" />
        <Skeleton className="ml-auto h-5 w-16 rounded-full" />
      </div>
    </div>
  );
}

export function InventorySummary({ initialStats }: Props) {
  const { refreshKey } = useDashboardRefresh();
  const [stats, setStats] = useState<Stats>(initialStats);
  const [variants, setVariants] = useState<VariantItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [, startTransition] = useTransition();

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, variantsRes] = await Promise.all([
        fetch("/api/dashboard/stats"),
        fetch("/api/dashboard/inventory"),
      ]);
      const [statsResult, variantsResult] = await Promise.all([
        statsRes.json(),
        variantsRes.json(),
      ]);
      if (statsResult.success) setStats(statsResult.data);
      if (variantsResult.success) setVariants(variantsResult.data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    startTransition(() => {
      fetchData();
    });
  }, [fetchData, startTransition]);

  useEffect(() => {
    if (refreshKey > 0) {
      startTransition(() => {
        fetchData();
      });
    }
  }, [refreshKey, fetchData, startTransition]);

  const toggle = (productId: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  };

  const groups = groupByProduct(variants);

  function renderVariantRow(v: VariantItem) {
    return (
      <div
        key={v.variantId}
        className="flex items-center justify-between gap-3 border-b border-border/15 last:border-0 px-4 py-2.5 pl-10"
      >
        <div className="min-w-0 flex-1">
          <span className="text-sm text-muted-foreground">
            {[v.color, v.size].filter(Boolean).join(" / ") || "Default"}
          </span>
        </div>
        <Badge variant={stockBadgeVariant[v.status]} className="shrink-0">
          {v.stock}
        </Badge>
      </div>
    );
  }

  return (
    <Card variant="default">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/30 bg-muted/5">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10">
            <Package className="size-4 text-amber-500" />
          </div>
          <CardTitle className="text-base">Inventory</CardTitle>
        </div>
        <Link href="/dashboard/inventory">
          <Button variant="ghost" size="sm" className="gap-1.5">
            View All
            <ArrowRight className="size-3.5 transition-transform duration-200 group-hover/button:translate-x-0.5" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-4 sm:p-5">
        {/* Summary stats */}
        <div className="mb-4 grid grid-cols-3 gap-3 rounded-xl bg-muted/20 p-3">
          <div className="space-y-0.5 text-center">
            <p className="text-xs text-muted-foreground">Products</p>
            <p className="text-sm font-semibold text-foreground">{stats.totalProducts}</p>
          </div>
          <div className="space-y-0.5 text-center">
            <p className="text-xs text-muted-foreground">Variants</p>
            <p className="text-sm font-semibold text-foreground">{stats.totalVariants}</p>
          </div>
          <div className="space-y-0.5 text-center">
            <p className="text-xs text-muted-foreground">Total Stock</p>
            <p className="text-sm font-semibold text-foreground">{stats.totalStockUnits}</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-muted/50">
              <Package className="size-6 text-muted-foreground/60" />
            </div>
            <p className="text-sm font-medium text-foreground">No variants yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Add products with variants to start tracking inventory.
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {groups.map((group) => {
              const isExpanded = expanded.has(group.productId);
              const hasAlert = group.variants.some(
                (v) => v.status === "out_of_stock" || v.status === "low_stock"
              );

              return (
                <div
                  key={group.productId}
                  className={cn(
                    "rounded-xl border transition-colors",
                    isExpanded
                      ? "border-border/50 bg-muted/10"
                      : "border-border/30 hover:border-border/50 hover:bg-muted/10"
                  )}
                >
                  {/* Product row */}
                  <button
                    type="button"
                    onClick={() => toggle(group.productId)}
                    className="flex w-full items-center gap-3 px-3.5 py-3 text-left"
                  >
                    <ChevronRight
                      className={cn(
                        "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                        isExpanded && "rotate-90"
                      )}
                    />
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                      {group.productName}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {group.variants.length} {group.variants.length === 1 ? "variant" : "variants"}
                    </span>
                    {hasAlert && (
                      <span className="size-1.5 shrink-0 rounded-full bg-amber-500" />
                    )}
                  </button>

                  {/* Expanded variants */}
                  {isExpanded && (
                    <div className="border-t border-border/20">
                      {group.variants.map(renderVariantRow)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
