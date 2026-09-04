# KRAVA

KRAVA is a client-side e-commerce storefront for an Egyptian streetwear hoodie brand. It is built as a lightweight, dependency-free static site — vanilla HTML, CSS, and modular JavaScript (ES modules) — that supports product browsing with color/size variants and live stock awareness, a persistent cart, coupon discounts, and a simulated checkout flow. All product images are served from Cloudinary, and there is no backend: state lives entirely in the browser.

## Live Demo

**https://krava-store.vercel.app/**

## Features

### Shopping experience
- Product grid rendered dynamically from a static in-file catalog (3 hoodie products)
- Sorting: Latest (default), Price Low → High, Price High → Low, Name A–Z
- Color variant selection with per-color product images and image-dot gallery
- Size selection (M / L / XL / 2XL) with per-variant stock levels — out-of-stock sizes are visually disabled and blocked with a toast
- Automatic fallback to an in-stock size when the selected size is unavailable for a newly chosen color
- Product detail page with URL-synced state (`?id=&color=&size=`), shareable/bookmarkable selections
- "Add to Cart" and "Buy Now" (direct checkout) actions with stock validation

### Cart
- Line items keyed by product + color + size (same variant merges into one line)
- Quantity increase/decrease with live stock checks against the catalog
- Item removal and "Empty Cart"
- Cart summary: item count, subtotal, discount, final total (EGP)
- Empty-cart state with a "Go Shopping" shortcut

### Coupons & checkout
- Coupon engine supporting percentage discounts (`krava10`, `krava20`, `krava30`) and fixed-amount discounts (`vip` → 200 EGP)
- Coupon input in the checkout modal with debounced (400 ms) validation and inline feedback
- Checkout modal with client-side form validation (name ≥ 3 chars, Egyptian 11-digit phone, address ≥ 10 chars) and inline error messages
- Payment method selection: Cash on Delivery, Visa (demo), Vodafone Cash (demo)
- Order confirmation modal with a generated order ID (`KRAVA-XXXX` via the Web Crypto API) and a 48-hour delivery countdown
- The cart is cleared after a successful order

### UI/UX
- Light/dark theme toggle persisted across sessions
- Shared header (logo, navigation, cart badge) and footer injected on every page
- Live cart-count badge synchronized across pages via the store's subscribe mechanism
- Auto-playing lookbook image slider (3.5 s interval) with prev/next controls
- Toast notifications for user feedback (out-of-stock warnings, invalid input, order success)
- Glassmorphism-style modals

## Tech Stack

**Core**
- HTML5 (semantic markup, `data-page` routing attribute)
- CSS3 (CSS custom properties, Grid/Flexbox, `data-theme` theming, media queries)
- Vanilla JavaScript (ES modules, no frameworks, no build step)

**Libraries / vendor assets**
- Font Awesome (self-hosted CSS + webfonts) for icons
- normalize.css for CSS baseline

**Browser APIs**
- `localStorage` (state + theme persistence)
- Web Crypto API (`crypto.getRandomValues` for order IDs)
- `URLSearchParams` and the History API (`replaceState`) for URL state

**Assets / platform**
- Cloudinary for all product, hero, lookbook, and brand imagery
- Vercel for static hosting

## Project Architecture

KRAVA is a multi-page static site driven by a single JavaScript entry point. Each page's `<body>` carries a `data-page` attribute; `js/app.js` reads it and boots only the modules needed for that page. Shared UI (header, footer, theme, cart badge, checkout modals) is injected at runtime by `js/core/layout.js`.

State management follows a small pub/sub store pattern: `js/core/store.js` holds a single `state` object (cart, coupon, theme), persists it to `localStorage` on every mutation, and notifies subscribed UI (e.g., the cart badge, the cart page renderer).

```
KRAVA/
├── index.html              # Home: hero, product grid, lookbook slider, about, contact
├── product.html            # Product detail shell (rendered by JS)
├── cart.html               # Cart page shell (rendered by JS)
├── css/
│   ├── master.css          # All app styles, theme variables, responsive rules
│   ├── normalize.css       # CSS reset
│   └── all.min.css         # Font Awesome
├── js/
│   ├── app.js              # Entry point / page router
│   ├── products.js         # Static product catalog (variants, images, stock)
│   ├── core/
│   │   ├── layout.js       # Shared header/footer injection + bootstrap
│   │   ├── store.js        # State manager: cart, coupon, persistence, pub/sub
│   │   └── toast.js        # Shared toast notifications
│   └── modules/
│       ├── ui.js           # Product grid rendering + card interactions
│       ├── product-page.js # Product detail page logic
│       ├── cart-page.js    # Cart page logic
│       ├── checkout.js     # Checkout/success modals, form validation
│       ├── coupons.js      # Coupon database + discount calculation
│       ├── theme.js        # Light/dark theme handling
│       └── slider.js       # Lookbook slider
└── webfonts/               # Font Awesome font files
```

## Pages

### `index.html` — Home

## Core Functionality

**Product data.** The catalog is a static array in `js/products.js`. Each product has variants by color; each color carries its own image set and a per-size `stock` map (a count of `0` means out of stock for that color/size combination).

**Cart state.** Cart items are stored as `{ key, id, name, price, color, size, img, quantity }`, where `key = id-color-size`. Adding the same variant again increments quantity; `buyNow()` replaces the cart with a single item and opens checkout directly.

**Persistence.** The whole app state (cart, applied coupon) is serialized to `localStorage` under the key **`krava-store`** on every state change and restored (with defensive parsing/fallback to defaults) on load. The theme is stored separately under **`krava-theme`** and applied via the `data-theme` attribute on `<html>`. Pages stay synchronized because every page runs the same store, and subscribed renderers (cart badge, cart page) re-render on any state change.

**Coupons.** Codes are matched case-insensitively after trimming. Percentage coupons reduce the subtotal by a percentage; fixed coupons are capped at the subtotal; the final total never goes below zero.

**Checkout.** Client-side only: validates the form, generates an order ID with `crypto.getRandomValues`, clears the cart, and shows a confirmation modal with a live 48-hour delivery countdown. No order data is transmitted anywhere.

**Notifications.** `js/core/toast.js` provides temporary toast messages (success/error) appended to a shared toast container.

## Data & State Management

| Data | Source | Persisted? | Key |
|---|---|---|---|
| Product catalog | `js/products.js` (static) | No | — |
| Cart + coupon | In-memory store | Yes (on every mutation) | `krava-store` |
| Theme | `data-theme` attribute | Yes | `krava-theme` |


## Responsive Design

The layout uses CSS Grid/Flexbox with a mobile-first `container` and breakpoints at **900px**, **768px**, **640/639px**, **600px**, and **480px** (e.g., stacked product-detail layout below 900px, re-gridded cart items below 600px). The viewport meta tag is set on all pages.

## Accessibility

Practices found in the code:
- Semantic HTML (`header`, `nav`, `main`, `section`, `article`, `footer`)
- `aria-label` on the theme toggle, cart link, color/size controls, coupon/checkout inputs, and quantity buttons; `aria-pressed` on the theme toggle
- `alt` attributes on product and lookbook imagery; decorative icons use empty `alt`
- Color and size pickers use `role="button"` with descriptive labels
- The main navigation has `aria-label="Main navigation"`

No formal WCAG audit or automated accessibility testing has been performed, so no compliance claim is made.

## Installation & Local Development

This is a fully static site with no dependencies and no build step. Because the JavaScript uses ES modules, it must be served over HTTP (opening `index.html` via `file://` will fail due to CORS restrictions on module scripts).

```bash
# Clone
git clone https://github.com/bassim-ghaly-14/KRAVA-store.git
cd KRAVA-store

# Serve with any static server, e.g.:
npx serve .          # or
python3 -m http.server 8000
```

Then open `http://localhost:8000` (or the port your server reports). The repo also includes a `.vscode/settings.json` preset for the VS Code **Live Server** extension (port 5502).

## Usage

1. Browse hoodies on the home page; sort with the dropdown.
2. On any product card (or the product detail page), pick a color and an in-stock size.
3. **Add to Cart** to accumulate items, or **Buy Now** to jump straight to checkout.
4. Open the cart via the 🛒 badge to adjust quantities or remove items.
5. In checkout, optionally enter a coupon code (e.g., `krava10` or `vip`), fill in name / 11-digit phone / address, choose a payment method, and place the order.

## Deployment

The site is deployed as a static build on **Vercel** (https://krava-store.vercel.app/). No custom deployment configuration files (e.g., `vercel.json`) are present in the repository — Vercel serves the static files as-is.

## Browser Support

The site targets modern evergreen browsers. It relies on ES modules, CSS custom properties, and `crypto.getRandomValues`, all widely supported in current Chrome, Edge, Firefox, and Safari. No transpilation or polyfills are provided.

## Known Limitations

- **No backend.** Orders are not transmitted or stored server-side; checkout is a client-side simulation, and payment options other than Cash on Delivery are labeled demo.
- **Static catalog.** Products, prices, and stock levels are hardcoded in `js/products.js`; stock counts are not decremented by purchases.
- **Client-side persistence only.** Cart, coupon, and theme live in `localStorage`, scoped to a single browser/device.
- **Client-side rendering.** Product grid, detail, and cart content are injected by JavaScript, limiting SEO for dynamic content.
- **No automated tests**, no linter/build tooling, and no license file in the repository.
- The theme is stored in two places (the `theme` field inside `krava-store` and the separate `krava-theme` key); only the latter is actively used by the theme module.

## Future Improvements

- Backend/API integration for real orders, inventory, and payment processing
- Automated testing (unit + E2E) and linting
- Server-rendered or pre-rendered pages for better SEO
- Real inventory management and stock decrementation
- Analytics/observability for the storefront

## License

No license is currently specified in this repository.

## Author

**Bassim Ghaly** — [GitHub](https://github.com/bassim-ghaly-14)

State recovery: if the saved blob is missing or malformed JSON, the store falls back to defaults (empty cart, no coupon). Corrupt cart arrays are replaced with an empty array.

Hero section, the sortable product grid (color swatches, size chips, image-dot gallery, Add to Cart / Buy Now / View actions), an auto-playing lookbook slider, an about section, and a contact section (email, WhatsApp, social links). Navigation anchors to `#hoodies`, `#about`, `#contact`.

### `product.html` — Product Detail
Renders a single product based on the `?id=` query parameter (shows "Product not found" for unknown IDs). Preloads all color-variant images for instant switching, supports color/size selection with stock awareness, syncs the current selection back into the URL via `history.replaceState`, and provides Add to Cart / Buy Now.

### `cart.html` — Cart
Lists cart line items with thumbnail, variant info, quantity controls (stock-checked), and per-item removal. Shows subtotal, discount, and total; supports "Empty Cart" and opens the checkout modal.

