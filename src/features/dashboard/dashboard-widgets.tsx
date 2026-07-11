"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle,
  AlertTriangle,
  XCircle,
  CheckCircle,
} from "lucide-react";

interface Stats {
  todayOrders: number;
  pendingOrders: number;
  processingOrders: number;
  deliveredOrders: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  completedOrders: number;
}

interface Props {
  stats: Stats;
}

export function DashboardWidgets({ stats }: Props) {
  const cards = [
    {
<<<<<<< HEAD
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      href: "/dashboard/inventory",
      color: "text-[var(--aara-secondary)]",
      bg: "bg-[var(--aara-highlight)]/20",
    },
    {
      title: "Total Variants",
      value: stats.totalVariants,
      icon: Layers,
      href: "/dashboard/inventory",
      color: "text-[var(--aara-accent)]",
      bg: "bg-[var(--aara-highlight)]/20",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: Users,
      href: "/dashboard/customers",
      color: "text-[var(--aara-secondary)]",
      bg: "bg-[var(--aara-highlight)]/20",
    },
    {
      title: "Total Stock Units",
      value: stats.totalStockUnits,
      icon: ShoppingCart,
      href: "/dashboard/inventory/stock",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
=======
      title: "Today's Orders",
      value: stats.todayOrders,
      icon: ShoppingBag,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: Clock,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Processing Orders",
      value: stats.processingOrders,
      icon: Truck,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Delivered Orders",
      value: stats.deliveredOrders,
      icon: CheckCircle,
      color: "text-primary",
      bgColor: "bg-primary/10",
>>>>>>> f2172a4 (added settings)
    },
    {
      title: "Low Stock",
      value: stats.lowStockProducts,
      icon: AlertTriangle,
<<<<<<< HEAD
      href: "/dashboard/inventory/stock",
      color: stats.lowStockProducts > 0 ? "text-amber-600" : "text-muted-foreground",
      bg: stats.lowStockProducts > 0 ? "bg-amber-50" : "bg-muted",
=======
      color: "text-secondary",
      bgColor: "bg-secondary/10",
>>>>>>> f2172a4 (added settings)
    },
    {
      title: "Out of Stock",
      value: stats.outOfStockProducts,
      icon: XCircle,
<<<<<<< HEAD
      href: "/dashboard/inventory/stock",
      color: stats.outOfStockProducts > 0 ? "text-destructive" : "text-muted-foreground",
      bg: stats.outOfStockProducts > 0 ? "bg-red-50" : "bg-muted",
    },
    {
      title: "Completed Orders",
      value: stats.completedOrders,
      icon: CheckCircle,
      href: "/dashboard/customers",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
=======
      color: "text-destructive",
      bgColor: "bg-destructive/10",
>>>>>>> f2172a4 (added settings)
    },
  ];

  return (
<<<<<<< HEAD
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {cards.map((card) => (
        <Link key={card.title} href={card.href}>
          <Card className="group cursor-pointer border-border transition-all duration-200 hover:shadow-lg">
=======
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.title}
            className="group cursor-default transition-all duration-200 hover:translate-y-[-2px] hover:shadow-card-hover"
          >
>>>>>>> f2172a4 (added settings)
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
<<<<<<< HEAD
              <div className={`flex size-9 items-center justify-center rounded-xl ${card.bg} transition-transform duration-200 group-hover:scale-110`}>
                <card.icon className={`size-4 ${card.color}`} />
=======
              <div className={`rounded-lg ${card.bgColor} p-2 transition-transform duration-200 group-hover:scale-110`}>
                <Icon className={`size-4 ${card.color}`} />
>>>>>>> f2172a4 (added settings)
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">{card.value}</div>
            </CardContent>
          </Card>
<<<<<<< HEAD
        </Link>
      ))}
=======
        );
      })}
>>>>>>> f2172a4 (added settings)
    </div>
  );
}
