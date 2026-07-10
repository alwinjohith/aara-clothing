import { Badge } from "@/components/ui/badge";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_VARIANTS,
  type OrderStatus,
} from "@/lib/constants";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <Badge variant={ORDER_STATUS_VARIANTS[status]}>
      {ORDER_STATUS_LABELS[status]}
    </Badge>
  );
}
