import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { effectiveUnitPrice } from "@/lib/product-pricing";

const orderSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).default(1),
  customerName: z.string().min(1),
  customerPhone: z.string().min(1),
  customerAddress: z.string().min(1),
  customerEmail: z.string().email().optional(),
});

function generateOrderNumber() {
  const ts = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `OC-CHAT-${ts}-${rand}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = orderSchema.parse(body);

    const product = await prisma.product.findUnique({
      where: { id: input.productId },
      select: { id: true, title: true, price: true, featuredImage: true, images: true, status: true, availableForSale: true, inventory: true, generalDiscountPercent: true, wholesaleDiscounts: true },
    });
    if (!product || product.status !== "ACTIVE" || !product.availableForSale) {
      return NextResponse.json({ error: "Product not available" }, { status: 400 });
    }
    if (product.inventory < input.quantity) {
      return NextResponse.json({ error: `Insufficient inventory. Available: ${product.inventory}` }, { status: 400 });
    }

    const firstImage = Array.isArray(product.images)
      ? ((product.images as unknown[]).find((x): x is string => typeof x === "string") ?? null)
      : null;

    const pricing = effectiveUnitPrice(product.price, input.quantity, product.generalDiscountPercent, product.wholesaleDiscounts);
    const subtotal = product.price * input.quantity;
    const discountedSubtotal = pricing.unitPrice * input.quantity;
    const discount = Math.round((subtotal - discountedSubtotal) * 100) / 100;
    const order = await prisma.$transaction(async (tx) => {
      const inventoryUpdate = await tx.product.updateMany({
        where: { id: product.id, status: "ACTIVE", availableForSale: true, inventory: { gte: input.quantity } },
        data: { inventory: { decrement: input.quantity } },
      });
      if (inventoryUpdate.count !== 1) {
        throw new Error("Inventory changed while placing the order. Please try again.");
      }
      return tx.order.create({ data: {
        orderNumber: generateOrderNumber(),
        customerName: input.customerName,
        customerEmail: input.customerEmail || "chat-order@auerviamaison.local",
        customerPhone: input.customerPhone,
        customerAddress: {
          line1: input.customerAddress,
          city: "N/A",
          country: "Pakistan",
        },
        items: [
          {
            productId: product.id,
            title: product.title,
            price: pricing.unitPrice,
            originalPrice: product.price,
            discountPercent: pricing.discountPercent,
            quantity: input.quantity,
            image: product.featuredImage || firstImage,
          },
        ],
        subtotal,
        discount,
        total: discountedSubtotal,
        paymentMethod: "cod",
        paymentStatus: "pending",
        orderStatus: "pending",
        notes: "Created from AI chatbot",
      } });
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: (error as Error).message || "Failed to place order" }, { status: 500 });
  }
}

