"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  Layers,
  Users,
  ShoppingCart,
  AlertTriangle,
  XCircle,
} from "lucide-react";

interface Stats {
  totalProducts: number;
  totalVariants: number;
  totalCustomers: number;
  totalStockUnits: number;
  lowStockProducts: number;
  outOfStockProducts: number;
}

interface Props {
  stats: Stats;
}

export function DashboardWidgets({ stats }: Props) {
  const cards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
    },
    {
      title: "Total Variants",
      value: stats.totalVariants,
      icon: Layers,
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: Users,
    },
    {
      title: "Total Stock Units",
      value: stats.totalStockUnits,
      icon: ShoppingCart,
    },
    {
      title: "Low Stock",
      value: stats.lowStockProducts,
      icon: AlertTriangle,
      className: stats.lowStockProducts > 0 ? "text-amber-600" : undefined,
    },
    {
      title: "Out of Stock",
      value: stats.outOfStockProducts,
      icon: XCircle,
      className: stats.outOfStockProducts > 0 ? "text-destructive" : undefined,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className={`size-4 text-muted-foreground ${card.className ?? ""}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
