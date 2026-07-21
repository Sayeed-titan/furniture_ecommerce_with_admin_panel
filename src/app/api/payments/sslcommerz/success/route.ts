import { NextResponse } from "next/server";

async function getTranId(request: Request): Promise<string | null> {
  const { searchParams } = new URL(request.url);
  if (searchParams.get("tran_id")) return searchParams.get("tran_id");

  try {
    const formData = await request.formData();
    return String(formData.get("tran_id") ?? "") || null;
  } catch {
    return null;
  }
}

async function handle(request: Request) {
  const tranId = await getTranId(request);
  const origin = new URL(request.url).origin;

  if (!tranId) {
    return NextResponse.redirect(new URL("/checkout/fail", origin));
  }

  // The IPN callback (not this browser redirect) is the source of truth for
  // payment status — this just sends the shopper to their receipt.
  return NextResponse.redirect(new URL(`/order/confirmation/${tranId}`, origin));
}

export async function GET(request: Request) {
  return handle(request);
}

export async function POST(request: Request) {
  return handle(request);
}
