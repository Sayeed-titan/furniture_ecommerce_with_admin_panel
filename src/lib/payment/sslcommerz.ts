/**
 * Server-only. Thin SSLCommerz wrapper (fetch, no SDK) — bundles bKash,
 * Nagad, cards, and mobile banking behind one hosted checkout. Configured
 * via env:
 *
 *   SSLCOMMERZ_STORE_ID        Store ID from the SSLCommerz merchant panel
 *   SSLCOMMERZ_STORE_PASSWORD  Store password from the merchant panel
 *   SSLCOMMERZ_SANDBOX         "true" (default) uses the free self-serve
 *                              sandbox; set to "false" once live credentials
 *                              are approved.
 *
 * The IPN callback (validateTransaction) is the source of truth for whether
 * a payment succeeded — the browser success-redirect is never trusted alone.
 */

const SANDBOX_BASE = "https://sandbox.sslcommerz.com";
const LIVE_BASE = "https://securepay.sslcommerz.com";

export function isSslcommerzConfigured(): boolean {
  return Boolean(process.env.SSLCOMMERZ_STORE_ID && process.env.SSLCOMMERZ_STORE_PASSWORD);
}

function baseUrl() {
  return process.env.SSLCOMMERZ_SANDBOX === "false" ? LIVE_BASE : SANDBOX_BASE;
}

export type InitSessionInput = {
  orderNumber: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  successUrl: string;
  failUrl: string;
  cancelUrl: string;
  ipnUrl: string;
};

export async function initSession(input: InitSessionInput): Promise<{ gatewayUrl: string }> {
  const storeId = process.env.SSLCOMMERZ_STORE_ID;
  const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD;
  if (!storeId || !storePassword) throw new Error("SSLCommerz is not configured");

  const body = new URLSearchParams({
    store_id: storeId,
    store_passwd: storePassword,
    total_amount: input.amount.toFixed(2),
    currency: "BDT",
    tran_id: input.orderNumber,
    success_url: input.successUrl,
    fail_url: input.failUrl,
    cancel_url: input.cancelUrl,
    ipn_url: input.ipnUrl,
    cus_name: input.customerName,
    cus_email: input.customerEmail || "customer@presidentfurniture.com.bd",
    cus_add1: input.customerAddress,
    cus_city: input.customerCity,
    cus_country: "Bangladesh",
    cus_phone: input.customerPhone,
    shipping_method: "NO",
    product_name: `Order ${input.orderNumber}`,
    product_category: "Furniture",
    product_profile: "general",
  });

  const res = await fetch(`${baseUrl()}/gwprocess/v4/api.php`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const data = (await res.json()) as {
    status?: string;
    GatewayPageURL?: string;
    failedreason?: string;
  };

  if (data.status !== "SUCCESS" || !data.GatewayPageURL) {
    throw new Error(data.failedreason || "Could not start the payment session.");
  }

  return { gatewayUrl: data.GatewayPageURL };
}

export type ValidationResult = {
  status?: string;
  tran_id?: string;
  val_id?: string;
  amount?: string;
  currency?: string;
  [key: string]: unknown;
};

export async function validateTransaction(valId: string): Promise<ValidationResult | null> {
  const storeId = process.env.SSLCOMMERZ_STORE_ID;
  const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD;
  if (!storeId || !storePassword) return null;

  const url = new URL(`${baseUrl()}/validator/api/validationserverAPI.php`);
  url.searchParams.set("val_id", valId);
  url.searchParams.set("store_id", storeId);
  url.searchParams.set("store_passwd", storePassword);
  url.searchParams.set("format", "json");

  const res = await fetch(url.toString());
  if (!res.ok) return null;
  return (await res.json()) as ValidationResult;
}
