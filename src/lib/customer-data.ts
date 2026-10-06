import { prisma } from "@/lib/prisma";
/* eslint-disable @typescript-eslint/no-explicit-any */

export const publicCustomerInclude = {
  wishlistItems: { include: { product: true }, orderBy: { createdAt: "desc" as const } },
  orders: { orderBy: { createdAt: "desc" as const } },
} as const;

export function customerSummary(customer: any) {
  const orders = customer.orders ?? [];
  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
    dateOfBirth: customer.dateOfBirth,
    createdAt: customer.createdAt,
    updatedAt: customer.updatedAt,
    lastActiveAt: customer.lastActiveAt,
    cartSnapshot: customer.cartSnapshot,
    wishlist: (customer.wishlistItems ?? []).map((item: any) => ({
      id: item.id,
      productId: item.productId,
      createdAt: item.createdAt,
      product: item.product,
    })),
    orders,
    stats: {
      totalOrders: orders.length,
      completedOrders: orders.filter((order: any) => order.orderStatus === "completed").length,
      pendingOrders: orders.filter((order: any) => !["completed", "cancelled"].includes(order.orderStatus)).length,
      cancelledOrders: orders.filter((order: any) => order.orderStatus === "cancelled").length,
      totalSpent: orders.filter((order: any) => order.orderStatus === "completed").reduce((sum: number, order: any) => sum + order.total, 0),
      lastOrderDate: orders[0]?.createdAt ?? null,
    },
  };
}

export async function logCustomerActivity(customerId: string, type: string, description: string, metadata?: object) {
  await prisma.customerActivity.create({ data: { customerId, type, description, metadata } });
}
