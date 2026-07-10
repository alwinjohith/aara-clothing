import { prisma } from "@/lib/prisma";
import type {
  CustomerQuery,
  CreateCustomerInput,
  UpdateCustomerInput,
} from "./customers-validation";

export async function listCustomers(query: CustomerQuery) {
  const { page, limit, search } = query;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      skip,
      take: limit,
      include: {
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.customer.count({ where }),
  ]);

  const enriched = await Promise.all(
    data.map(async (customer) => {
      const lastOrder = await prisma.order.findFirst({
        where: { customerId: customer.id },
        orderBy: { createdAt: "desc" },
        select: { createdAt: true },
      });
      return {
        ...customer,
        orderCount: customer._count.orders,
        lastOrderDate: lastOrder?.createdAt ?? null,
      };
    })
  );

  return {
    data: enriched,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getCustomerById(id: string) {
  return prisma.customer.findUnique({
    where: { id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        take: 100,
      },
    },
  });
}

export async function createCustomer(input: CreateCustomerInput) {
  const existingPhone = await prisma.customer.findUnique({
    where: { phone: input.phone },
  });
  if (existingPhone) throw new Error("A customer with this phone number already exists");

  return prisma.customer.create({
    data: {
      name: input.name,
      phone: input.phone,
      address: input.address ?? null,
    },
  });
}

export async function updateCustomer(id: string, input: UpdateCustomerInput) {
  const existing = await prisma.customer.findUnique({ where: { id } });
  if (!existing) return null;

  if (input.phone && input.phone !== existing.phone) {
    const duplicatePhone = await prisma.customer.findUnique({
      where: { phone: input.phone },
    });
    if (duplicatePhone) throw new Error("A customer with this phone number already exists");
  }

  const data: Record<string, unknown> = {};
  if (input.name !== undefined) data.name = input.name;
  if (input.phone !== undefined) data.phone = input.phone;
  if (input.address !== undefined) data.address = input.address ?? null;

  return prisma.customer.update({
    where: { id },
    data,
  });
}

export async function deleteCustomer(id: string) {
  const existing = await prisma.customer.findUnique({ where: { id } });
  if (!existing) return null;

  const orderCount = await prisma.order.count({ where: { customerId: id } });
  if (orderCount > 0) {
    throw new Error("Cannot delete customer with existing orders");
  }

  return prisma.customer.delete({ where: { id } });
}
