/**
 * app/routes/address-conflict.jsx
 *
 * Public route — no Shopify auth needed.
 * Clients land here by clicking a link in their conflict email.
 *
 * URL pattern:
 *   /address-conflict?token=<TOKEN>&choice=shopify
 *   /address-conflict?token=<TOKEN>&choice=intake
 */

import { useLoaderData } from "react-router";
import { resolveAddressConflict } from "../address-conflict.server";

// ─── Loader: process the choice immediately on page load ─────────────────────
export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const choice = url.searchParams.get("choice");

  // Validate inputs
  if (!token || !choice) {
    return {
      success: false,
      error: "Invalid link. Please check your email and try again.",
    };
  }

  if (choice !== "shopify" && choice !== "intake") {
    return {
      success: false,
      error: "Unknown address choice. Please click one of the buttons in your email.",
    };
  }

  try {
    const result = await resolveAddressConflict(token, choice);
    return result;
  } catch (err) {
    console.error("Error resolving address conflict:", err);
    return {
      success: false,
      error: "Something went wrong. Please contact support.",
    };
  }
};

// ─── Page Component ───────────────────────────────────────────────────────────
export default function AddressConflictPage() {
  const data = useLoaderData();

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Logo / Brand */}
        <div style={styles.logoArea}>
          <div style={styles.logoCircle}>✉️</div>
        </div>

        {data.success ? (
          <SuccessView data={data} />
        ) : (
          <ErrorView error={data.error} />
        )}
      </div>
    </div>
  );
}

// ─── Success State ────────────────────────────────────────────────────────────
function SuccessView({ data }) {
  const isShopify = data.choice === "shopify";
  const addr = data.selectedAddress || {};

  const addressLines = [
    addr.street || addr.address1,
    addr.unit || addr.address2,
    [addr.locality || addr.city, addr.region || addr.province, addr.postalCode || addr.zip]
      .filter(Boolean)
      .join(", "),
    addr.country || addr.country_code,
  ].filter(Boolean);

  if (data.alreadyResolved) {
    return (
      <>
        <div style={styles.iconBadge("orange")}>⚠️</div>
        <h1 style={styles.heading}>Already Confirmed</h1>
        <p style={styles.subtext}>
          You've already confirmed your address preference. No further action is needed.
        </p>
        <div style={{ ...styles.addressBox, borderColor: "#f6ad55" }}>
          <p style={styles.addressLabel}>
            {data.choice === "shopify" ? "Shopify Address was used" : "Intake Form Address was kept"}
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <div style={styles.iconBadge("#48bb78")}>✅</div>
      <h1 style={styles.heading}>Address Confirmed!</h1>
      <p style={styles.subtext}>
        Thank you, {data.clientName?.split(" ")[0] || "there"}! We've updated your records
        to use your {isShopify ? "Shopify checkout" : "intake form"} address.
      </p>

      <div style={styles.addressBox}>
        <p style={styles.addressLabel}>
          {isShopify ? "📦 Shopify Checkout Address" : "📋 Intake Form Address"}
        </p>
        {addressLines.map((line, i) => (
          <p key={i} style={styles.addressLine}>
            {line}
          </p>
        ))}
      </div>

      <p style={styles.footer}>
        Your order will be processed with this address. If you need to make changes,
        please contact our support team.
      </p>
    </>
  );
}

// ─── Error State ──────────────────────────────────────────────────────────────
function ErrorView({ error }) {
  return (
    <>
      <div style={styles.iconBadge("#fc8181")}>❌</div>
      <h1 style={styles.heading}>Something Went Wrong</h1>
      <p style={styles.subtext}>{error}</p>
      <p style={styles.footer}>
        Please check your email for a valid confirmation link, or contact our support team
        for assistance.
      </p>
    </>
  );
}

// ─── Inline Styles ────────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f0f4ff 0%, #fafafa 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  card: {
    background: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
    padding: "48px 40px",
    maxWidth: "480px",
    width: "100%",
    textAlign: "center",
  },
  logoArea: {
    marginBottom: "24px",
  },
  logoCircle: {
    fontSize: "40px",
    display: "inline-block",
  },
  iconBadge: (color) => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    background: typeof color === "string" && color.startsWith("#") ? color + "20" : "#f0fff4",
    fontSize: "28px",
    marginBottom: "20px",
  }),
  heading: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1a202c",
    margin: "0 0 12px",
  },
  subtext: {
    fontSize: "15px",
    color: "#4a5568",
    lineHeight: "1.6",
    margin: "0 0 24px",
  },
  addressBox: {
    border: "1px solid #68d391",
    borderRadius: "10px",
    padding: "16px 20px",
    background: "#f0fff4",
    marginBottom: "24px",
    textAlign: "left",
  },
  addressLabel: {
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#276749",
    margin: "0 0 8px",
  },
  addressLine: {
    fontSize: "14px",
    color: "#2d3748",
    margin: "0 0 2px",
    lineHeight: "1.6",
  },
  footer: {
    fontSize: "13px",
    color: "#a0aec0",
    lineHeight: "1.5",
    margin: 0,
  },
};
