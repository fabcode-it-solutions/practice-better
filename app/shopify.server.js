import "@shopify/shopify-app-react-router/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
} from "@shopify/shopify-app-react-router/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.October25,
  scopes: process.env.SCOPES?.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  future: {
    expiringOfflineAccessTokens: true,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
});

export default shopify;
export const apiVersion = ApiVersion.October25;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;

/**
 * Executes a GraphQL query against the Shopify Admin API.
 * @param {Request|Function} requestOrClient - The request object or the admin.graphql function.
 * @param {string} query - The GraphQL query string.
 * @param {Object} variables - Optional variables for the query.
 * @returns {Promise<Object>} The JSON response from the GraphQL API.
 */
export async function queryGraphQL(requestOrClient, query, variables = {}) {
  let client = requestOrClient;
  
  // If it's a Request object (has headers), authenticate and get the client
  if (requestOrClient.headers && typeof requestOrClient.headers.get === 'function') {
    const { admin } = await shopify.authenticate.admin(requestOrClient);
    client = admin.graphql;
  }

  const response = await client(query, { variables });
  const json = await response.json();
  
  return json;
}

