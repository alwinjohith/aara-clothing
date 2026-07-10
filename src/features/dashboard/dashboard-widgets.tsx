"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  Layers,
  Users,
  ShoppingCart,
  AlertTriangle,
  XCircle,
  ClipboardList,
  Clock,
  RefreshCw,
  CheckCircle2,
  Ban,
} from "lucide-react";

interface Stats {
  totalProducts: number;
  totalVariants: number;
  totalCustomers: number;
  totalStockUnits: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  todayOrders: number;
  pendingOrders: number;
  processingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
}

interface Props {
  stats: Stats;
}

export function DashboardWidgets({ stats }: Props) {
  const cards = [
    {
      title: "Today's Orders",
      value: stats.todayOrders,
      icon: ClipboardList,
      className: stats.todayOrders > 0 ? "text-blue-600" : undefined,
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: Clock,
      className: stats.pendingOrders > 0 ? "text-amber-600" : undefined,
    },
    {
      title: "Processing Orders",
      value: stats.processingOrders,
      icon: RefreshCw,
      className: stats.processingOrders > 0 ? "text-blue-600" : undefined,
    },
    {
      title: "Completed Orders",
      value: stats.completedOrders,
      icon: CheckCircle2,
      className: stats.completedOrders > 0 ? "text-emerald-600" : undefined,
    },
    {
      title: "Cancelled Orders",
      value: stats.cancelledOrders,
      icon: Ban,
      className: stats.cancelledOrders > 0 ? "text-destructive" : undefined,
    },
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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
