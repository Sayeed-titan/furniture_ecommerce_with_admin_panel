import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { escapeHtml, sendNotification } from "@/lib/email";

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
    include: { items: { include: { product: { select: { name: true } } } } },
  });

  // Best-effort notification to the business — never blocks the response.
  const products = lead.items.map((i) => i.product.name);
  await sendNotification({
    subject: `New lead: ${name}`,
    replyTo: email,
    html: `
      <h2>New lead from the website</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ""}
      ${message ? `<p><strong>Message:</strong><br/>${escapeHtml(message)}</p>` : ""}
      ${
        products.length
          ? `<p><strong>Interested in:</strong></p><ul>${products
              .map((p) => `<li>${escapeHtml(p)}</li>`)
              .join("")}</ul>`
          : ""
      }
    `,
  });

  return NextResponse.json({ id: lead.id }, { status: 201 });
}
