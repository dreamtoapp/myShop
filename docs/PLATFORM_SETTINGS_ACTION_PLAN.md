# 🚀 Platform Settings — Discussion-First Action Plan (Ideas Only)

## Why this doc
Short, decision-friendly ideas to shape Platform Settings. No code. We'll discuss, then decide.

## Current snapshot (today)
- Business hours (moved to Shipping Rules)
- Delivery basics (radius/fee/free threshold — moved to Shipping Rules)
- Basic tax concept (separate from actual Company.taxPercentage)
- Notification toggles (not wired to providers)
- Platform status/maintenance (UI-only)

## What will be most useful (by business value)

### 1) Checkout & Payments (high impact)
- Payment methods: Mada / Visa / Mastercard, Apple Pay, Cash on Delivery (COD fee)
- Order limits: min/max order value, max items per order
- VAT behavior: single VAT% (KSA), price display incl/excl VAT, invoice footer text
- Refund & cancellation windows (hours, auto-status rules)

### 2) Shipping & Fulfillment (high impact)
- Dedicated page: Health Hub → Settings → Shipping Rules
- Contains: business hours, shipping fee, free-shipping threshold, delivery radius
- Next: fee strategies (flat, free-above-X, zone-based), pickup toggle
- Next: handling time & delivery SLA labels, out-of-area behavior

### 3) Inventory & Products (high impact)
- Low-stock threshold; sold-out behavior (hide/show-unavailable/allow backorder)
- Track inventory toggle; cart reserve duration
- Default listing size; default sort (relevance/newest/price)
- Reviews: enable, moderation, show ratings

### 4) Customer Experience (medium–high)
- Accounts: require email/phone verification; allow guest checkout
- Loyalty/UX: wishlist, recently viewed, related products
- Search: suggestions, fuzzy matching, filters (price/brand/availability/rating)
- Localization: currency formatting, number/date locale, RTL hints

### 5) Growth & Marketing (medium)
- Coupons & automatic discounts (buy X get Y, category %, seasonal)
- Newsletter opt-in, abandoned cart reminders (email/WhatsApp roadmap)
- Social sharing toggles on product/offer pages
- SEO defaults: title/meta patterns, index/noindex per section

### 6) Analytics & Observability (medium)
- Tracking IDs: Google Analytics, Meta Pixel (enable/disable + IDs)
- Error monitoring toggle (client/server) + sample rate
- Sales & inventory report presets (weekly/monthly)

### 7) Security & Compliance (medium)
- 2FA for admins, password rules, account lockout threshold
- Privacy controls (data export, retention window)
- Legal pages links (Privacy/Terms/Refund/Shipping) management

### 8) Integrations (roadmap)
- Shipping: SMSA / Aramex / DHL (rates + label gen)
- Communications: email provider, SMS, WhatsApp Business
- Accounting: QuickBooks/Zoho basic order export

## Admin UX principles
- Group by categories (Payments, Shipping, Orders, Inventory, Customers, Marketing, Analytics, Security, Integrations)
- Plain toggles + short descriptions; avoid long forms
- "What users see" preview for VAT/delivery SLA
- Save per-section with optimistic feedback

## Phased rollout (proposal)
- Phase 1 — Fast impact: Payments (Mada/Apple Pay/COD + fees), Shipping (flat + free-above-X, radius, pickup), Inventory (low-stock, sold-out), Orders (refund/cancel windows, default status)
- Phase 2 — Experience & growth: Search/filters, product display, reviews, coupons/newsletter, SEO, analytics IDs & error monitoring
- Phase 3 — Integrations & automation: Shipping partners groundwork, basic accounting export, notifications providers (email/SMS/WhatsApp), scheduled admin reports

## Success metrics
- Conversion lift after enabling local payments
- AOV change after free-shipping threshold
- Stockouts reduction after low-stock alerts
- Fewer support tickets after clearer delivery/tax settings

## Open questions
- Payment priorities for KSA: Mada/Apple Pay/COD mix?
- Pickup now or later?
- Shipping model now: flat + free-above-X vs zones?
- Guest checkout allowed?
- Minimum viable coupons: simple % off vs rules?
- Analytics mandate: GA only or GA + Pixel?

Once we agree on scope per phase, we'll translate into tasks.
