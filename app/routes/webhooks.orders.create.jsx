import { authenticate } from "../shopify.server";
import {
  createPracticeBetterClient,
  classifyProductType,
} from "../practice-better.server";
import { checkAndHandleAddressConflict } from "../address-conflict.server";

export const action = async ({ request }) => {
  const { shop, payload, topic } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);
  console.log(
    `Order ID: ${payload.id} | Customer: ${payload.customer?.email || "unknown"}`,
  );

  // ── Log line items for visibility ──────────────────────────────────────────
  if (payload.line_items?.length) {
    console.log(
      "Line Items:",
      payload.line_items.map((i) => ({
        title: i.title,
        variant: i.variant_title,
        sku: i.sku,
      })),
    );
  }

  // ── Check if this order is relevant before doing anything ─────────────────
  // classifyProductType returns "Lab + Consult", "Consult", or null
  const productType = classifyProductType(payload.line_items || []);

  if (!productType) {
    console.log(
      `Order #${payload.id} skipped — does not contain Lab or Consult products.`,
    );
    return new Response();
  }

  // ── Process the order ──────────────────────────────────────────────────────
  console.log(
    `Order #${payload.id} qualifies (${productType}). Sending to Practice Better...`,
  );

  // ── Step 2: Create or retrieve PB client ───────────────────────────────────
  let pbClient = null;

  try {
    pbClient = await createPracticeBetterClient(payload);
  } catch (error) {
    console.error(
      `❌ Error creating Practice Better client for order #${payload.id}:`,
      error,
    );
    return new Response();
  }

  if (!pbClient) {
    console.warn(
      `⚠️ No PB client returned for order #${payload.id}. Skipping address check.`,
    );
    return new Response();
  }

  console.log(
    `✅ PB client ready (ID: ${pbClient.id}) for order #${payload.id}.`,
  );

  // ── Step 3: Check for address conflict ─────────────────────────────────────
  // Only meaningful when client already existed in PB with an intake form address.
  try {
    await checkAndHandleAddressConflict(payload, pbClient);
  } catch (error) {
    // Non-fatal — log and continue
    console.error(
      `⚠️ Address conflict check failed for order #${payload.id}:`,
      error.message,
    );
  }

  return new Response();
};
