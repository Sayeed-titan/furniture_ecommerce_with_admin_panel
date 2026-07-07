import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const leadSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().max(50).optional(),
  message: z.string().max(2000).optional(),
  productIds: z.array(z.string()).max(50).optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = leadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { name, email, phone, message, productIds } = parsed.data;

  const lead = await prisma.lead.create({
    data: {
      name,
      email,
      phone,
      message,
      items: productIds?.length
        ? { create: productIds.map((productId) => ({ productId })) }
        : undefined,
    },
  });

  return NextResponse.json({ id: lead.id }, { status: 201 });
}
