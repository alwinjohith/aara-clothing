import { prisma } from "@/lib/prisma";
import type {
  CustomerQuery,
  CreateCustomerInput,
  UpdateCustomerInput,
} from "./customers-validation";

function serialize(data: unknown) {
  return JSON.parse(JSON.stringify(data));
}

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
      orderBy: { createdAt: "desc" },
    }),
    prisma.customer.count({ where }),
  ]);

  return serialize({
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}

export async function getCustomerById(id: string) {
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  return customer ? serialize(customer) : null;
}

export async function getCustomerDetail(id: string) {
  const [customer, orderAggregation] = await Promise.all([
    prisma.customer.findUnique({
      where: { id },
      include: {
        orders: {
          orderBy: { createdAt: "desc" },
          take: 50,
        },
      },
    }),
    prisma.order.aggregate({
      where: { customerId: id },
      _count: { id: true },
      _sum: { total: true },
      _max: { createdAt: true },
    }),
  ]);

  if (!customer) return null;

  return serialize({
    ...customer,
    totalOrders: orderAggregation._count.id,
    totalSpent: Number(orderAggregation._sum.total ?? 0),
    lastOrderDate: orderAggregation._max.createdAt,
  });
}

export async function createCustomer(input: CreateCustomerInput) {
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
