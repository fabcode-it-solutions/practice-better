/**
 * address-conflict.server.js
 *
 * Handles the address conflict workflow:
 *   1. Compare Shopify address vs Practice Better address
 *   2. If mismatch detected → store pending conflict in DB
 *   3. Email the client with two action links to resolve it
 *   4. Handle the client's choice → update the correct system
 *
 * NOTE: This is a portfolio copy of a client project. The proprietary
 * comparison logic, email template, and field-mapping details have been
 * removed. Only the architecture/shape of the flow remains for
 * demonstration purposes — this file will not run as-is.
 */

import prisma from "./db.server";

const API_BASE_URL = "https://api.practicebetter.io";
const APP_URL = process.env.SHOPIFY_APP_URL || "https://example.com";

// ─── Conflict Detection ───────────────────────────────────────────────────────
/**
 * Compares a Shopify address against a Practice Better address and returns
 * the list of conflicting fields, or false if none.
 * Original normalisation/comparison rules removed for portfolio purposes.
 */
export function detectAddressConflict(shopifyAddress, pbAddress) {
  // Proprietary comparison logic removed for portfolio purposes.
  return false;
}

// ─── Store Conflict in DB ─────────────────────────────────────────────────────
export async function storeAddressConflict(details) {
  // Proprietary persistence logic removed for portfolio purposes.
  throw new Error("Not implemented in portfolio version.");
}

// ─── Send Conflict Email ──────────────────────────────────────────────────────
/**
 * Sends the client a branded email with two links to confirm which
 * address should be used. Original HTML template and SMTP wiring
 * removed for portfolio purposes.
 */
export async function sendAddressConflictEmail(details) {
  // Proprietary email template and delivery logic removed for portfolio purposes.
  throw new Error("Not implemented in portfolio version.");
}

// ─── Handle Client Choice ─────────────────────────────────────────────────────
/**
 * Called when a client clicks "Use Shopify Address" or "Use Intake Form
 * Address" from the conflict email. Resolves the conflict and updates
 * the appropriate system.
 */
export async function resolveAddressConflict(token, choice) {
  // Proprietary resolution logic removed for portfolio purposes.
  throw new Error("Not implemented in portfolio version.");
}

// ─── Update Practice Better Address ──────────────────────────────────────────
async function updatePracticeBetterAddress(pbClientId, shopifyAddress) {
  // Proprietary update logic removed for portfolio purposes.
  throw new Error("Not implemented in portfolio version.");
}

// ─── Main Entry: Check & Trigger Conflict Flow ────────────────────────────────
/**
 * Called after a client is found/created in Practice Better. Compares the
 * Shopify order address with the PB profile address, and if a conflict is
 * detected, stores it and sends the conflict resolution email.
 */
export async function checkAndHandleAddressConflict(order, pbClient) {
  // Proprietary orchestration logic removed for portfolio purposes.
  throw new Error("Not implemented in portfolio version.");
}
