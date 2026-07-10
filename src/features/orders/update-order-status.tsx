"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ORDER_STATUS_LABELS } from "@/lib/constants";

interface Props {
  orderId: string;
  customerId: string;
  currentStatus: string;
  newStatus: string;
}

export function UpdateOrderStatus({ orderId, customerId, currentStatus, newStatus }: Props) {
  const router = useRouter();

  async function handleClick() {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.error);

      toast.success(
        `Order status updated from ${ORDER_STATUS_LABELS[currentStatus as keyof typeof ORDER_STATUS_LABELS]} to ${ORDER_STATUS_LABELS[newStatus as keyof typeof ORDER_STATUS_LABELS]}`
      );
      router.refresh();
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleClick}>
      {ORDER_STATUS_LABELS[newStatus as keyof typeof ORDER_STATUS_LABELS] ?? newStatus}
    </Button>
  );
}
