import { prisma } from "@/lib/prisma";
import { ORDER_STATUSES, getValidOrderStatusTransitions } from "@/lib/constants";
import type {
  CreateOrderInput,
  UpdateOrderInput,
  UpdateOrderStatusInput,
  OrderQuery,
} from "./orders-validation";

function serialize(data: unknown) {
  return JSON.parse(JSON.stringify(data));
}

function generateOrderNumber(count: number): string {
  return `ORD-${String(count + 1).padStart(5, "0")}`;
}

export async function listOrders(query: OrderQuery) {
  const { page, limit, search, status, dateFrom, dateTo } = query;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { orderNumber: { contains: search, mode: "insensitive" } },
      { customer: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  if (status) {
    where.status = status;
  }

  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) {
      (where.createdAt as Record<string, unknown>).gte = new Date(dateFrom);
    }
    if (dateTo) {
      (where.createdAt as Record<string, unknown>).lte = new Date(dateTo);
    }
  }

  const [data, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      include: {
        customer: {
          select: { id: true, name: true, phone: true },
        },
        items: {
          include: {
            variant: {
              select: {
                id: true,
                color: true,
                size: true,
                sku: true,
                product: {
                  select: { id: true, name: true },
                },
              },
            },
          },
        },
        user: {
          select: { id: true, username: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.count({ where }),
  ]);

  return serialize({
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}

export async function getOrderById(id: string) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      customer: true,
      items: {
        include: {
          variant: {
            include: {
              product: {
                select: { id: true, name: true, price: true },
              },
              images: {
                take: 1,
                select: { url: true },
              },
            },
          },
        },
      },
      user: {
        select: { id: true, username: true },
      },
    },
  });

  if (!order) return null;
  return serialize(order);
}

export async function createOrder(input: CreateOrderInput, userId: string) {
  const { customerId, items, notes } = input;

  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
  });
  if (!customer) {
    throw new Error("Customer not found");
  }

  const variants = await prisma.productVariant.findMany({
    where: { id: { in: items.map((i) => i.variantId) } },
    include: {
      product: {
        select: { id: true, name: true, price: true, deletedAt: true, isActive: true },
      },
    },
  });

  const variantMap = new Map(variants.map((v) => [v.id, v]));

  for (const item of items) {
    const variant = variantMap.get(item.variantId);
    if (!variant) {
      throw new Error(`Variant ${item.variantId} not found`);
    }
    if (variant.product.deletedAt) {
      throw new Error(`Product "${variant.product.name}" has been deleted`);
    }
    if (!variant.product.isActive) {
      throw new Error(`Product "${variant.product.name}" is not active`);
    }
    if (variant.stock < item.quantity) {
      throw new Error(
        `Insufficient stock for ${variant.product.name} (${variant.color}/${variant.size}). Available: ${variant.stock}, requested: ${item.quantity}`
      );
    }
  }

  const orderCount = await prisma.order.count();

  return prisma.$transaction(async (tx) => {
    let subtotal = 0;
    const orderItemsData = items.map((item) => {
      const variant = variantMap.get(item.variantId)!;
      const price = Number(variant.product.price);
      const itemSubtotal = price * item.quantity;
      subtotal += itemSubtotal;
      return {
        variantId: item.variantId,
        quantity: item.quantity,
        price,
        subtotal: itemSubtotal,
      };
    });

    const order = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(orderCount),
        customerId,
        subtotal,
        discount: 0,
        total: subtotal,
        notes: notes ?? null,
        createdBy: userId,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        customer: true,
        items: {
          include: {
            variant: {
              include: {
                product: {
                  select: { id: true, name: true, price: true },
                },
              },
            },
          },
        },
      },
    });

    for (const item of items) {
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return serialize(order);
  });
}

export async function updateOrder(
  id: string,
  input: UpdateOrderInput,
  userId: string
) {
  const existing = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          variant: {
            select: { id: true, stock: true },
          },
        },
      },
    },
  });

  if (!existing) {
    throw new Error("Order not found");
  }

  if (!["PENDING", "PROCESSING"].includes(existing.status)) {
    throw new Error("Only pending or processing orders can be edited");
  }

  const { customerId, items, notes } = input;

  if (customerId) {
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });
    if (!customer) {
      throw new Error("Customer not found");
    }
  }

  if (items) {
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: items.map((i) => i.variantId) } },
      include: {
        product: {
          select: { id: true, name: true, price: true, deletedAt: true, isActive: true },
        },
      },
    });

    const variantMap = new Map(variants.map((v) => [v.id, v]));

    for (const item of items) {
      const variant = variantMap.get(item.variantId);
      if (!variant) {
        throw new Error(`Variant ${item.variantId} not found`);
      }
      if (variant.product.deletedAt) {
        throw new Error(`Product "${variant.product.name}" has been deleted`);
      }
      if (!variant.product.isActive) {
        throw new Error(`Product "${variant.product.name}" is not active`);
      }

      const oldItem = existing.items.find(
        (oi) => oi.variantId === item.variantId
      );
      const oldQty = oldItem?.quantity ?? 0;
      const netChange = item.quantity - oldQty;

      if (netChange > 0) {
        if (variant.stock < netChange) {
          throw new Error(
            `Insufficient stock for ${variant.product.name} (${variant.color}/${variant.size}). Available: ${variant.stock}, need additional: ${netChange}`
          );
        }
      }
    }

    return prisma.$transaction(async (tx) => {
      let subtotal = 0;
      const orderItemsData = items.map((item) => {
        const variant = variantMap.get(item.variantId)!;
        const price = Number(variant.product.price);
        const itemSubtotal = price * item.quantity;
        subtotal += itemSubtotal;
        return {
          variantId: item.variantId,
          quantity: item.quantity,
          price,
          subtotal: itemSubtotal,
        };
      });

      const oldItemMap = new Map(
        existing.items.map((i) => [i.variantId, i])
      );

      for (const item of items) {
        const oldItem = oldItemMap.get(item.variantId);
        const oldQty = oldItem?.quantity ?? 0;
        const netChange = item.quantity - oldQty;

        if (netChange !== 0) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: netChange } },
          });
        }
      }

      const removedItems = existing.items.filter(
        (oi) => !items.find((ni) => ni.variantId === oi.variantId)
      );

      for (const removed of removedItems) {
        await tx.productVariant.update({
          where: { id: removed.variantId },
          data: { stock: { increment: removed.quantity } },
        });
      }

      await tx.orderItem.deleteMany({ where: { orderId: id } });

      const updateData: Record<string, unknown> = {
        subtotal,
        total: subtotal,
        discount: 0,
      };
      if (notes !== undefined) {
        updateData.notes = notes ?? null;
      }
      if (customerId) {
        updateData.customerId = customerId;
      }

      const order = await tx.order.update({
        where: { id },
        data: {
          ...updateData,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          customer: true,
          items: {
            include: {
              variant: {
                include: {
                  product: {
                    select: { id: true, name: true, price: true },
                  },
                },
              },
            },
          },
        },
      });

      return serialize(order);
    });
  }

  const updateData: Record<string, unknown> = {};
  if (notes !== undefined) {
    updateData.notes = notes ?? null;
  }
  if (customerId) {
    updateData.customerId = customerId;
  }

  if (Object.keys(updateData).length === 0) {
    return serialize(existing);
  }

  return serialize(await prisma.order.update({
    where: { id },
    data: updateData,
    include: {
      customer: true,
      items: {
        include: {
          variant: {
            include: {
              product: {
                select: { id: true, name: true, price: true },
              },
            },
          },
        },
      },
    },
  }));
}

export async function updateOrderStatus(
  id: string,
  input: UpdateOrderStatusInput
) {
  const existing = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          variant: {
            select: { id: true, stock: true },
          },
        },
      },
    },
  });

  if (!existing) {
    throw new Error("Order not found");
  }

  const allowedTransitions = getValidOrderStatusTransitions(
    existing.status as keyof typeof ORDER_STATUSES
  );

  if (!allowedTransitions.includes(input.status)) {
    throw new Error(
      `Cannot transition from ${existing.status} to ${input.status}`
    );
  }

  if (
    input.status === "CANCELLED" &&
    existing.status !== "CANCELLED"
  ) {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: { id },
        data: { status: input.status },
        include: {
          customer: true,
          items: {
            include: {
              variant: {
                include: {
                  product: {
                    select: { id: true, name: true, price: true },
                  },
                },
              },
            },
          },
        },
      });

      for (const item of existing.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { increment: item.quantity } },
        });
      }

      return serialize(order);
    });
  }

  return serialize(await prisma.order.update({
    where: { id },
    data: { status: input.status },
    include: {
      customer: true,
      items: {
        include: {
          variant: {
            include: {
              product: {
                select: { id: true, name: true, price: true },
              },
            },
          },
        },
      },
    },
  }));
}

export async function cancelOrder(id: string) {
  return updateOrderStatus(id, { status: "CANCELLED" });
}
