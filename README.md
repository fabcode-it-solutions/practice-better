# Shopify ↔ Practice Better Integration

A custom Shopify app that connects a merchant's store to **Practice Better**, a client-management platform used by health and wellness practices. Built to automatically turn qualifying Shopify orders into client records — no manual data entry required.

> **Note:** This is a portfolio copy of a real client engagement. The proprietary business rules (classification logic, field mappings, email templates, and API payloads) have been removed from the public copy below — the code here shows the **architecture and approach**, not a working clone.

## What it does

- **Listens for new Shopify orders** via the `orders/create` webhook and filters for the ones relevant to the practice (based on tags, SKUs, and product titles on the line items).
- **Finds or creates the matching client** in Practice Better, mapping Shopify customer, address, and marketing-consent data into the platform's client profile.
- **Detects address conflicts** between what a customer entered at Shopify checkout and what's already on file in Practice Better (e.g. from an intake form), so the wrong address never quietly reaches shipping or lab results.
- **Emails the client** a branded confirmation link when a conflict is found, letting them pick which address to trust — with the choice automatically synced back.
- **Embeds in the Shopify Admin** as a standard Shopify app (App Bridge + Polaris), with additional in-admin views for product/order visibility.

## How it's built

| Layer | Tech |
| --- | --- |
| App framework | [React Router](https://reactrouter.com/) (Shopify's official app template, adapted from Remix) |
| Shopify integration | `@shopify/shopify-app-react-router`, Admin GraphQL API, webhooks |
| Data | Prisma ORM + SQLite (session storage & address-conflict tracking) |
| External API | Practice Better REST API (OAuth2 client-credentials flow) |
| Email | SMTP via Nodemailer, custom HTML templates |
| UI | Shopify Polaris / App Bridge |

## Architecture at a glance

```
Shopify order created
        │
        ▼
 orders/create webhook  ──▶  classify order (relevant / not)
        │
        ▼
 find-or-create client in Practice Better
        │
        ▼
 compare Shopify address vs. Practice Better address
        │
        ├── match ──▶ done
        │
        └── conflict ──▶ store pending conflict ──▶ email client
                                                          │
                                                          ▼
                                         client picks an address ──▶ synced back
```

Key files:

- [`app/routes/webhooks.orders.create.jsx`](app/routes/webhooks.orders.create.jsx) — webhook entry point and orchestration
- [`app/practice-better.server.js`](app/practice-better.server.js) — Practice Better API integration (auth, lookup, client creation)
- [`app/address-conflict.server.js`](app/address-conflict.server.js) — address comparison, conflict storage, and resolution email
- [`app/routes/app.address-conflict.jsx`](app/routes/app.address-conflict.jsx) — the public confirmation page a client lands on from the email

## About this repo

This code was built as a paid client project and is shared here to demonstrate the integration pattern and code quality. Because it contains business logic specific to that client, the working implementation details have been stripped from the files above — they will not run out of the box, and this repo is **not** intended to be cloned and deployed.

If you're evaluating this as part of a hiring or contracting decision and want to see the full working version under NDA, get in touch.
