"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  Layers,
  Users,
  ShoppingCart,
  AlertTriangle,
  XCircle,
  Clock,
  CheckCircle,
  XOctagon,
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
  deliveredOrders: number;
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
      icon: ShoppingCart,
      href: "/dashboard/customers",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: Clock,
      href: "/dashboard/customers",
    },
    {
      title: "Processing Orders",
      value: stats.processingOrders,
      icon: Package,
      href: "/dashboard/customers",
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      href: "/dashboard/inventory",
    },
    {
      title: "Total Variants",
      value: stats.totalVariants,
      icon: Layers,
      href: "/dashboard/inventory",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: Users,
      href: "/dashboard/customers",
    },
    {
      title: "Total Stock Units",
      value: stats.totalStockUnits,
      icon: ShoppingCart,
      href: "/dashboard/inventory/stock",
    },
    {
      title: "Low Stock",
      value: stats.lowStockProducts,
      icon: AlertTriangle,
      className: stats.lowStockProducts > 0 ? "text-amber-600" : undefined,
      href: "/dashboard/inventory/stock",
    },
    {
      title: "Out of Stock",
      value: stats.outOfStockProducts,
      icon: XCircle,
      className: stats.outOfStockProducts > 0 ? "text-destructive" : undefined,
      href: "/dashboard/inventory/stock",
    },
    {
      title: "Delivered Orders",
      value: stats.deliveredOrders,
      icon: CheckCircle,
      href: "/dashboard/customers",
    },
    {
      title: "Cancelled Orders",
      value: stats.cancelledOrders,
      icon: XOctagon,
      href: "/dashboard/customers",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Link key={card.title} href={card.href}>
          <Card className="transition-colors hover:bg-muted/50 cursor-pointer">
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
        </Link>
      ))}
    </div>
  );
}
